import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminNav />
      <main className="flex-1 overflow-x-auto p-4 sm:p-8 lg:p-12">{children}</main>
    </div>
  );
}
