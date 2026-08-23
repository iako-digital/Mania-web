import "../globals.css";

export const metadata = {
  title: "Admin — Mania Vashakidze",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-ink text-text-primary">{children}</body>
    </html>
  );
}
