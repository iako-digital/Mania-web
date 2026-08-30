import type { PaymentProvider } from "@/lib/orders/types";

export interface BankAccount {
  provider: PaymentProvider;
  bankName: string;
  accountHolder: string;
  iban: string;
}

// Manual bank-transfer target accounts, shown on /checkout/manual-transfer.
// Configure the real IBANs via env — left blank, the checkout page still
// renders with a clear "not configured" notice instead of a broken page.
export function getBankAccounts(): BankAccount[] {
  const accountHolder = process.env.BANK_ACCOUNT_HOLDER_NAME || "";

  return [
    { provider: "BOG", bankName: "საქართველოს ბანკი (BOG)", accountHolder, iban: process.env.BOG_ACCOUNT_IBAN || "" },
    { provider: "TBC", bankName: "თიბისი ბანკი (TBC)", accountHolder, iban: process.env.TBC_ACCOUNT_IBAN || "" },
  ];
}
