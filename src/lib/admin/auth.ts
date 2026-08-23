import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set.");
  }
  return secret;
}

function sign(value: string): string {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createSessionToken(): string {
  const expires = String(Date.now() + SESSION_TTL_MS);
  return `${expires}.${sign(expires)}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;

  const expected = sign(expires);
  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (signatureBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(signatureBuf, expectedBuf)) return false;

  return Number(expires) > Date.now();
}

export function verifyPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  const candidateBuf = Buffer.from(candidate);
  const expectedBuf = Buffer.from(expected);
  if (candidateBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(candidateBuf, expectedBuf);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionToken(store.get(ADMIN_COOKIE_NAME)?.value);
}
