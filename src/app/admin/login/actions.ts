"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, createSessionToken, verifyPassword } from "@/lib/admin/auth";
import { bootstrapSuperAdmin, findAdminByEmail, getAdmins } from "@/lib/admin/queries";

export interface LoginState {
  error?: string;
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return { error: "ადმინის შესვლა ჯერ არ არის კონფიგურირებული სერვერზე (აკლია ADMIN_PASSWORD / ADMIN_SESSION_SECRET)." };
  }

  if (!email) {
    return { error: "მიუთითეთ ელ-ფოსტა." };
  }

  if (!verifyPassword(password)) {
    return { error: "პაროლი არასწორია." };
  }

  const existingAdmins = await getAdmins();
  const admin = existingAdmins.length === 0 ? await bootstrapSuperAdmin(email) : await findAdminByEmail(email);

  if (!admin) {
    return { error: "ეს ელ-ფოსტა არ არის დამატებული ადმინისტრატორად. მიმართეთ Super Admin-ს." };
  }

  const store = await cookies();
  store.set({
    name: ADMIN_COOKIE_NAME,
    value: createSessionToken(admin.email),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  redirect("/admin");
}
