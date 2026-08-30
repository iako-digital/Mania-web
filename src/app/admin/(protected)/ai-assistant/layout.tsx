import { requireSuperAdmin } from "@/lib/admin/auth";

export default async function SuperAdminOnlyLayout({ children }: { children: React.ReactNode }) {
  await requireSuperAdmin();
  return children;
}
