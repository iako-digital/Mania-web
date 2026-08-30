import { randomUUID } from "crypto";
import { readContent, writeContent } from "@/lib/content/store";
import type { AdminRole, AdminUser } from "./types";

const FILE = "admins.json";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function getAdmins(): Promise<AdminUser[]> {
  try {
    return await readContent<AdminUser[]>(FILE);
  } catch {
    return [];
  }
}

export async function findAdminByEmail(email: string): Promise<AdminUser | undefined> {
  const admins = await getAdmins();
  const normalized = normalizeEmail(email);
  return admins.find((admin) => normalizeEmail(admin.email) === normalized);
}

export async function addAdmin(input: { name: string; email: string; role: AdminRole }): Promise<AdminUser> {
  const admins = await getAdmins();
  const normalized = normalizeEmail(input.email);
  if (admins.some((admin) => normalizeEmail(admin.email) === normalized)) {
    throw new Error("ეს ელ-ფოსტა უკვე დამატებულია ადმინისტრატორად.");
  }

  const admin: AdminUser = {
    id: randomUUID(),
    name: input.name.trim(),
    email: normalized,
    role: input.role,
    createdAt: new Date().toISOString(),
  };
  await writeContent(FILE, [...admins, admin]);
  return admin;
}

export async function removeAdmin(id: string): Promise<void> {
  const admins = await getAdmins();
  const target = admins.find((admin) => admin.id === id);
  if (!target) return;

  const remaining = admins.filter((admin) => admin.id !== id);
  const superAdminsLeft = remaining.filter((admin) => admin.role === "super_admin").length;
  if (target.role === "super_admin" && superAdminsLeft === 0) {
    throw new Error("ბოლო Super Admin-ის წაშლა შეუძლებელია.");
  }

  await writeContent(FILE, remaining);
}

export async function updateAdminRole(id: string, role: AdminRole): Promise<void> {
  const admins = await getAdmins();
  const target = admins.find((admin) => admin.id === id);
  if (!target) return;

  if (target.role === "super_admin" && role !== "super_admin") {
    const otherSuperAdmins = admins.filter((admin) => admin.id !== id && admin.role === "super_admin").length;
    if (otherSuperAdmins === 0) {
      throw new Error("ბოლო Super Admin-ის როლის შეცვლა შეუძლებელია.");
    }
  }

  const updated = admins.map((admin) => (admin.id === id ? { ...admin, role } : admin));
  await writeContent(FILE, updated);
}

// The admin list starts empty, so the very first successful password login
// (see admin/login/actions.ts) has no admin record to look up a role from.
// That login bootstraps itself as the first Super Admin instead of failing —
// otherwise nobody could ever reach /admin/admins to add themselves.
export async function bootstrapSuperAdmin(email: string): Promise<AdminUser> {
  const admins = await getAdmins();
  if (admins.length > 0) {
    throw new Error("ბუთსტრეპი შესაძლებელია მხოლოდ მაშინ, როცა ადმინისტრატორი არცერთია დამატებული.");
  }

  const normalized = normalizeEmail(email);
  const localPart = normalized.split("@")[0] || normalized;
  const name =
    localPart
      .replace(/[._-]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") || normalized;

  const admin: AdminUser = {
    id: randomUUID(),
    name,
    email: normalized,
    role: "super_admin",
    createdAt: new Date().toISOString(),
  };
  await writeContent(FILE, [admin]);
  return admin;
}
