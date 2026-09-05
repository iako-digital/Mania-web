import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { readContent, writeContent } from "@/lib/content/store";

const FILE = "student-credentials.json";
const KEY_LENGTH = 64;

interface StudentCredential {
  email: string;
  passwordHash: string;
  updatedAt: string;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, KEY_LENGTH);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

function verifyHash(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;

  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, salt, KEY_LENGTH);
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

async function getCredentials(): Promise<StudentCredential[]> {
  try {
    return await readContent<StudentCredential[]>(FILE);
  } catch {
    return [];
  }
}

// Lets a student without (or unwilling to use) a Google account still sign
// in — the admin sets this from /admin/students, the student authenticates
// via the "credentials" provider in src/auth.ts. Hashed with scrypt via the
// built-in crypto module rather than adding a bcrypt dependency, matching
// the HMAC/timingSafeEqual approach already used for admin sessions (see
// src/lib/admin/auth.ts).
export async function setStudentPassword(email: string, password: string): Promise<void> {
  const normalized = normalizeEmail(email);
  const credentials = await getCredentials();
  const passwordHash = hashPassword(password);
  const now = new Date().toISOString();

  const existing = credentials.find((c) => c.email === normalized);
  if (existing) {
    existing.passwordHash = passwordHash;
    existing.updatedAt = now;
  } else {
    credentials.push({ email: normalized, passwordHash, updatedAt: now });
  }

  await writeContent(FILE, credentials);
}

export async function verifyStudentPassword(email: string, password: string): Promise<boolean> {
  const normalized = normalizeEmail(email);
  const credentials = await getCredentials();
  const record = credentials.find((c) => c.email === normalized);
  if (!record) return false;
  return verifyHash(password, record.passwordHash);
}

export async function hasStudentPassword(email: string): Promise<boolean> {
  const normalized = normalizeEmail(email);
  const credentials = await getCredentials();
  return credentials.some((c) => c.email === normalized);
}
