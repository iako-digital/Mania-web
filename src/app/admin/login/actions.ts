"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, createSessionToken, verifyPassword } from "@/lib/admin/auth";

export interface LoginState {
  error?: string;
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") || "");

  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return { error: "ადმინის შესვლა ჯერ არ არის კონფიგურირებული სერვერზე (აკლია ADMIN_PASSWORD / ADMIN_SESSION_SECRET)." };
  }

  if (!verifyPassword(password)) {
    return { error: "პაროლი არასწორია." };
  }

  const store = await cookies();
  store.set({
    name: ADMIN_COOKIE_NAME,
    value: createSessionToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  redirect("/admin");
}
