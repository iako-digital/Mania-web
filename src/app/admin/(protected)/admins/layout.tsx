import { requireSuperAdmin } from "@/lib/admin/auth";

export default async function AdminsOnlyLayout({ children }: { children: React.ReactNode }) {
  await requireSuperAdmin();
  return children;
}
