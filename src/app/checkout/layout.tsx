import "../globals.css";

export const metadata = {
  title: "გადახდა",
  robots: { index: false, follow: false },
};

export default function CheckoutRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka" suppressHydrationWarning>
      <body className="bg-ink text-text-primary">{children}</body>
    </html>
  );
}
