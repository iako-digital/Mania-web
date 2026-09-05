import Link from "next/link";
import { auth, isGoogleAuthConfigured } from "@/auth";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { SignOutButton } from "./SignOutButton";
import { CredentialsSignInForm } from "./CredentialsSignInForm";

const LINKS = [
  { href: "/dashboard", label: "ჩემი კაბინეტი" },
  { href: "/dashboard/manual-payments", label: "შეკვეთები და ქვითრები" },
];

export async function DashboardNav({ active }: { active: string }) {
  const session = await auth();

  return (
    <header className="border-b border-hairline">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <p className="font-display text-lg text-text-primary">პირადი კაბინეტი</p>
        <nav className="flex items-center gap-6">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                "font-mono text-xs uppercase tracking-widest transition-colors " +
                (active === link.href ? "text-gold" : "text-text-muted hover:text-text-primary")
              }
            >
              {link.label}
            </Link>
          ))}
          {session?.user ? (
            <SignOutButton />
          ) : (
            <>
              <GoogleSignInButton configured={isGoogleAuthConfigured()} />
              <CredentialsSignInForm />
            </>
          )}
          <Link href="/" className="font-mono text-xs uppercase tracking-widest text-text-muted hover:text-gold">
            საიტზე დაბრუნება
          </Link>
        </nav>
      </div>
    </header>
  );
}
