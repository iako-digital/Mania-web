import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { verifyStudentPassword } from "@/lib/auth/student-credentials";

// Accepts either naming convention: Auth.js v5's own auto-detected
// AUTH_GOOGLE_ID/AUTH_GOOGLE_SECRET, or the more commonly-documented Google
// Cloud Console naming GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET — whichever
// the deployer actually set as a secret, both work.
function googleClientId(): string | undefined {
  return process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID;
}
function googleClientSecret(): string | undefined {
  return process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET;
}

// Email+password login for students an admin has manually set a password
// for (see /admin/students → "პაროლის შეცვლა") — an alternative to Google
// for students who don't have (or don't want to use) a Gmail account.
const credentialsProvider = Credentials({
  id: "credentials",
  name: "Email & Password",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    const email = typeof credentials?.email === "string" ? credentials.email.trim() : "";
    const password = typeof credentials?.password === "string" ? credentials.password : "";
    if (!email || !password) return null;

    const valid = await verifyStudentPassword(email, password);
    if (!valid) return null;

    return { id: email, email, name: email };
  },
});

// JWT sessions (no database adapter) so this works today against the
// content/*.json data layer, with no dependency on the (not yet connected)
// Prisma/Supabase database — see prisma/schema.prisma's header comment for
// the eventual database-session cutover.
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google({ clientId: googleClientId(), clientSecret: googleClientSecret() }), credentialsProvider],
  session: { strategy: "jwt" },
  trustHost: true,
});

// Whether real Google OAuth credentials are configured — lets UI show a
// clear "not configured" state instead of a broken sign-in button, same
// degrade-gracefully pattern as Resend/Cloudinary/Bunny elsewhere in this
// app when their env vars are unset.
export function isGoogleAuthConfigured(): boolean {
  return Boolean(googleClientId() && googleClientSecret());
}
