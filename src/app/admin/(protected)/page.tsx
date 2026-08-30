import Link from "next/link";
import { getAdminSession } from "@/lib/admin/auth";

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
  { href: "/admin/sales", title: "გაყიდვები", description: "შემოსავლების ანალიტიკა — კურსები და თარგები, BOG / TBC." },
  { href: "/admin/verifications", title: "გადახდის დადასტურება", description: "ბანკში გადარიცხვის ქვითრები — დადასტურება ან უარყოფა." },
  { href: "/admin/ai-assistant", title: "AI ასისტენტი", description: "AI ასისტენტის პარამეტრები.", superAdminOnly: true },
  { href: "/admin/settings", title: "საიტის პარამეტრები", description: "საიტის სახელი, სლოგანი, ტელეფონი, ელ. ფოსტა, სოციალური ბმულები.", superAdminOnly: true },
  { href: "/admin/admins", title: "ადმინისტრატორები", description: "ადმინისტრატორების დამატება, წაშლა და როლების მართვა.", superAdminOnly: true },
];

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  const cards = CARDS.filter((card) => !card.superAdminOnly || session?.role === "super_admin");

  return (
    <div>
      <h1 className="font-display text-3xl text-text-primary">კონტენტი</h1>
      <p className="mt-2 text-text-muted">აირჩიეთ განყოფილება რედაქტირებისთვის.</p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
  );
}
