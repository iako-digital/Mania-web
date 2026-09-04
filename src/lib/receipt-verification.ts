import { callGemini } from "@/lib/gemini";
import { getBankAccounts } from "@/lib/payments/bank-accounts";
import type { AiReceiptVerification, PaymentProvider } from "@/lib/orders/types";

const MAX_RECEIPT_BYTES = 15 * 1024 * 1024; // Gemini's inline-data limit is ~20MB per request; leave headroom.

function isValidResult(value: unknown): value is Omit<AiReceiptVerification, "checkedAt"> {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.matchConfidence === "number" &&
    (typeof v.extractedAmount === "number" || v.extractedAmount === null) &&
    (typeof v.extractedDate === "string" || v.extractedDate === null) &&
    (typeof v.extractedReference === "string" || v.extractedReference === null) &&
    typeof v.bankMatch === "boolean" &&
    (v.recommendation === "approve" || v.recommendation === "review" || v.recommendation === "reject") &&
    typeof v.summary === "string"
  );
}

// Best-effort: fetches the uploaded receipt, sends it to Gemini's vision
// model alongside the order's expected details, and asks it to extract and
// cross-check the transfer. Returns null (never throws) on any failure —
// missing API key, unreachable file, oversized file, malformed AI response
// — so a receipt upload never fails or blocks because of this. The admin
// still has the receipt image itself and the manual approve/reject flow
// regardless of whether AI verification succeeded.
export async function verifyReceiptWithAi(params: {
  receiptUrl: string;
  provider: PaymentProvider;
  expectedAmount: number;
  expectedCurrency: string;
  orderCode: string;
  itemTitle: string;
}): Promise<AiReceiptVerification | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const fileRes = await fetch(params.receiptUrl);
    if (!fileRes.ok) return null;

    const contentLength = Number(fileRes.headers.get("content-length") || 0);
    if (contentLength > MAX_RECEIPT_BYTES) return null;

    const contentType = fileRes.headers.get("content-type") || "image/jpeg";
    const buffer = Buffer.from(await fileRes.arrayBuffer());
    if (buffer.byteLength > MAX_RECEIPT_BYTES) return null;
    const base64 = buffer.toString("base64");

    const account = getBankAccounts().find((a) => a.provider === params.provider);
    const bankLines = [account, ...getBankAccounts().filter((a) => a.provider !== params.provider)]
      .filter((a): a is NonNullable<typeof a> => Boolean(a?.iban))
      .map((a) => `${a.bankName} — მიმღები: ${a.accountHolder}, IBAN: ${a.iban}`)
      .join("\n");

    const prompt = `შენ ამოწმებ ბანკის გადარიცხვის ქვითარს (სურათი ან PDF) და ადარებ მას მოსალოდნელ შეკვეთის დეტალებთან.

მოსალოდნელი დეტალები:
- თანხა: ${params.expectedAmount} ${params.expectedCurrency}
- შეკვეთის კოდი (უნდა ჩანდეს დანიშნულების/რეფერენსის ველში): ${params.orderCode}
- პროდუქტი: ${params.itemTitle}
- მიმღები ანგარიშ(ებ)ი:
${bankLines || "(არ არის კონფიგურირებული)"}

ქვითრიდან ამოიღე: გადარიცხული თანხა, ტრანზაქციის თარიღი, დანიშნულების/რეფერენსის ველის ტექსტი (შეკვეთის კოდის საძებნელად), და მიმღების ანგარიშის დეტალები (შეადარე ზემოთ მოცემულს).

დააბრუნე მხოლოდ ერთი JSON ობიექტი ზუსტად ამ ფორმით:
{
  "matchConfidence": 0-100 (რიცხვი — რამდენად ემთხვევა ქვითარი მოსალოდნელ დეტალებს საერთო ჯამში),
  "extractedAmount": რიცხვი ან null,
  "extractedDate": "YYYY-MM-DD" ან null,
  "extractedReference": "ტექსტი დანიშნულების ველიდან" ან null,
  "bankMatch": true/false (მიმღების ანგარიში ემთხვევა თუ არა ზემოთ მოცემულს),
  "recommendation": "approve" | "review" | "reject",
  "summary": "მოკლე, ერთწინადოვანი შეჯამება ქართულად ადმინისთვის"
}
"recommendation" იყოს "approve" მხოლოდ თუ თანხა, მიმღები და რეფერენსი ყველა თანხვედრაშია. თუ სურათი გაუგებარია ან ეჭვგადასაშვებია, გამოიყენე "review". არაფერი დაწერო JSON-ის გარდა.`;

    const raw = await callGemini({
      apiKey,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }, { inlineData: { mimeType: contentType, data: base64 } }],
        },
      ],
      generationConfig: { responseMimeType: "application/json" },
    });

    const parsed = JSON.parse(raw);
    if (!isValidResult(parsed)) return null;

    return {
      matchConfidence: Math.max(0, Math.min(100, Math.round(parsed.matchConfidence))),
      extractedAmount: parsed.extractedAmount,
      extractedDate: parsed.extractedDate,
      extractedReference: parsed.extractedReference,
      bankMatch: parsed.bankMatch,
      recommendation: parsed.recommendation,
      summary: parsed.summary,
      checkedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error("[receipt-verification] AI check failed:", err);
    return null;
  }
}
