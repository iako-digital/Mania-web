import type { PaymentProvider } from "@/lib/orders/types";

export interface BankAccount {
  provider: PaymentProvider;
  bankName: string;
  accountHolder: string;
  iban: string;
}

// Manual bank-transfer target accounts, shown on /checkout/manual-transfer.
// Preferably configured via env (so a change doesn't need a redeploy), but
// these are the real, currently-active account details — not secrets, just
// public payment-receiving info meant to be shown to every visitor — so
// unlike an API key or password, hardcoding a fallback here carries no
// security risk. It exists specifically because Azure Static Web Apps
// needs env vars set in its own "Application Settings" (separate from the
// GitHub Actions build secrets) for a hybrid Next.js app's runtime code to
// see them, and that step is easy to miss — this fallback means checkout
// keeps working for real customers even if that's not done yet.
const FALLBACK_ACCOUNT_HOLDER = "მანია ვაშაკიძე";
const FALLBACK_BOG_IBAN = "GE98BG0000000612692174";
const FALLBACK_TBC_IBAN = "GE06TB7003045064300073";

export function getBankAccounts(): BankAccount[] {
  const accountHolder = process.env.BANK_ACCOUNT_HOLDER_NAME || FALLBACK_ACCOUNT_HOLDER;

  return [
    { provider: "BOG", bankName: "საქართველოს ბანკი (BOG)", accountHolder, iban: process.env.BOG_ACCOUNT_IBAN || FALLBACK_BOG_IBAN },
    { provider: "TBC", bankName: "თიბისი ბანკი (TBC)", accountHolder, iban: process.env.TBC_ACCOUNT_IBAN || FALLBACK_TBC_IBAN },
  ];
}
