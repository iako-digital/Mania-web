import Link from "next/link";
import { getAdminSession } from "@/lib/admin/auth";
import { getOrders } from "@/lib/orders/queries";
import { getCourses } from "@/lib/courses/queries";
import { getPatterns } from "@/lib/patterns/queries";
import { getUserAnalytics } from "@/lib/analytics";

const STATUS_LABEL: Record<string, string> = {
  pending_payment: "გადახდის მოლოდინში",
  pending_verification: "მოწმდება",
  paid: "გადახდილი",
  failed: "წარუმატებელი",
};

const CARDS = [
  { href: "/admin/hero", title: "თავსართი", description: "მთავარი გვერდის სათაური, ქვესათაური და გარეკანის მედია.", superAdminOnly: true },
  { href: "/admin/about", title: "ჩემ შესახებ", description: "ბიოგრაფია, კარიერის აღწერა, მიღწევები, პორტრეტი, პროგრამები.", superAdminOnly: true },
  { href: "/admin/skills", title: "უნარები", description: "ძირითადი უნარების სია, რომელიც ჩანს გვერდებზე „ექსპერტიზა“ და „ჩემ შესახებ“.", superAdminOnly: true },
  { href: "/admin/workflow", title: "სამუშაო პროცესი", description: "5-საფეხურიანი პროცესი „ექსპერტიზის“ გვერდზე.", superAdminOnly: true },
  { href: "/admin/categories", title: "კატეგორიები", description: "პორტფოლიოს კატეგორიების სახელები.", superAdminOnly: true },
  { href: "/admin/portfolio", title: "პორტფოლიო", description: "პროექტების დამატება, რედაქტირება და წაშლა.", superAdminOnly: true },
  { href: "/admin/courses", title: "კურსები", description: "კურსების მენეჯერი და Curriculum Builder — სექციები, გაკვეთილები, ვიდეო და PDF." },
  { href: "/admin/patterns", title: "თარგები", description: "თარგების (PDF) მენეჯერი — ფოტოები, ფასი, ფაილი." },
  { href: "/admin/students", title: "მოსწავლეები", description: "მოსწავლეთა პროგრესი და კურსებზე წვდომის მართვა." },
  { href: "/admin/promocodes", title: "პრომო კოდები", description: "პროდუქტზე მიბმული ფასდაკლების კოდების გენერაცია და მართვა." },
  { href: "/admin/sales", title: "გაყიდვები", description: "შემოსავლების ანალიტიკა — კურსები და თარგები, BOG / TBC." },
  { href: "/admin/verifications", title: "გადახდის დადასტურება", description: "ბანკში გადარიცხვის ქვითრები — დადასტურება ან უარყოფა." },
  { href: "/admin/ai-assistant", title: "AI ასისტენტი", description: "AI ასისტენტის პარამეტრები.", superAdminOnly: true },
  { href: "/admin/settings", title: "საიტის პარამეტრები", description: "საიტის სახელი, სლოგანი, ტელეფონი, ელ. ფოსტა, სოციალური ბმულები.", superAdminOnly: true },
  { href: "/admin/admins", title: "ადმინისტრატორები", description: "ადმინისტრატორების დამატება, წაშლა და როლების მართვა.", superAdminOnly: true },
];

export default async function AdminDashboardPage() {
  const [session, orders, courses, patterns, students] = await Promise.all([
    getAdminSession(),
    getOrders(),
    getCourses(),
    getPatterns(),
    getUserAnalytics(),
  ]);

  const totalRevenueGel = orders
    .filter((o) => o.status === "paid" && o.currency === "GEL")
    .reduce((total, o) => total + o.amount, 0);
  const pendingReceipts = orders.filter((o) => o.status === "pending_verification").length;
  const activeProducts = courses.filter((c) => c.published).length + patterns.filter((p) => p.published).length;

  const recentStudents = students.slice(0, 5);
  const recentOrders = orders.slice(0, 5);

  const cards = CARDS.filter((card) => !card.superAdminOnly || session?.role === "super_admin");

  return (
    <div>
      <h1 className="font-display text-3xl text-text-primary">მთავარი მიმოხილვა</h1>
      <p className="mt-2 text-text-muted">საიტის მთავარი მაჩვენებლები, ბოლო აქტივობა და სწრაფი მოქმედებები.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="border border-hairline bg-surface p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">სულ შემოსავალი</p>
          <p className="mt-2 font-display text-3xl text-gold">{totalRevenueGel} ₾</p>
        </div>
        <div className="border border-hairline bg-surface p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">რეგისტრირებული მოსწავლეები</p>
          <p className="mt-2 font-display text-3xl text-text-primary">{students.length}</p>
        </div>
        <div className="border border-hairline bg-surface p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">დასადასტურებელი ქვითრები</p>
          <p className="mt-2 font-display text-3xl text-text-primary">{pendingReceipts}</p>
        </div>
        <div className="border border-hairline bg-surface p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">აქტიური პროდუქტები</p>
          <p className="mt-2 font-display text-3xl text-text-primary">{activeProducts}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/admin/verifications"
          className="border border-hairline bg-surface px-5 py-3 font-mono text-xs uppercase tracking-widest text-text-muted transition-colors hover:border-gold hover:text-gold"
        >
          გადახდის დადასტურება →
        </Link>
        <Link
          href="/admin/promocodes"
          className="border border-hairline bg-surface px-5 py-3 font-mono text-xs uppercase tracking-widest text-text-muted transition-colors hover:border-gold hover:text-gold"
        >
          პრომო კოდის გენერაცია →
        </Link>
        <Link
          href="/admin/students"
          className="border border-hairline bg-surface px-5 py-3 font-mono text-xs uppercase tracking-widest text-text-muted transition-colors hover:border-gold hover:text-gold"
        >
          მოსწავლეების მართვა →
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-text-muted">ბოლო რეგისტრაციები</p>
          <div className="flex flex-col gap-2">
            {recentStudents.map((s) => (
              <div key={s.studentId} className="flex items-center justify-between border border-hairline bg-surface px-4 py-3">
                <div>
                  <p className="text-sm text-text-primary">{s.name || "—"}</p>
                  <p className="text-xs text-text-muted">{s.email || s.studentId}</p>
                </div>
                <p className="font-mono text-xs text-text-muted">{new Date(s.registeredAt).toLocaleDateString("ka-GE")}</p>
              </div>
            ))}
            {recentStudents.length === 0 && <p className="text-sm text-text-muted">ჯერ არცერთი მოსწავლე არ არის.</p>}
          </div>
        </div>

        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-text-muted">ბოლო შეკვეთები</p>
          <div className="flex flex-col gap-2">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between border border-hairline bg-surface px-4 py-3">
                <div>
                  <p className="text-sm text-text-primary">{o.itemTitle}</p>
                  <p className="text-xs text-text-muted">{o.studentName} · {o.amount} {o.currency}</p>
                </div>
                <span
                  className={
                    "font-mono text-xs " +
                    (o.status === "paid" ? "text-gold" : o.status === "failed" ? "text-red-400" : "text-text-muted")
                  }
                >
                  {STATUS_LABEL[o.status] ?? o.status}
                </span>
              </div>
            ))}
            {recentOrders.length === 0 && <p className="text-sm text-text-muted">ჯერ არცერთი შეკვეთა არ არის.</p>}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-text-muted">კონტენტის მართვა</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="border border-hairline bg-surface p-6 transition-colors hover:border-gold"
            >
              <h2 className="font-display text-lg text-text-primary">{card.title}</h2>
              <p className="mt-2 text-sm text-text-muted">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
