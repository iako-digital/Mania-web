import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

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

// JWT sessions (no database adapter) so this works today against the
// content/*.json data layer, with no dependency on the (not yet connected)
// Prisma/Supabase database — see prisma/schema.prisma's header comment for
// the eventual database-session cutover.
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google({ clientId: googleClientId(), clientSecret: googleClientSecret() })],
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
