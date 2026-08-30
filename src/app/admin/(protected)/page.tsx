import Link from "next/link";

const CARDS = [
  { href: "/admin/hero", title: "თავსართი", description: "მთავარი გვერდის სათაური, ქვესათაური და გარეკანის მედია." },
  { href: "/admin/about", title: "ჩემ შესახებ", description: "ბიოგრაფია, კარიერის აღწერა, მიღწევები, პორტრეტი, პროგრამები." },
  { href: "/admin/skills", title: "უნარები", description: "ძირითადი უნარების სია, რომელიც ჩანს გვერდებზე „ექსპერტიზა“ და „ჩემ შესახებ“." },
  { href: "/admin/workflow", title: "სამუშაო პროცესი", description: "5-საფეხურიანი პროცესი „ექსპერტიზის“ გვერდზე." },
  { href: "/admin/categories", title: "კატეგორიები", description: "პორტფოლიოს კატეგორიების სახელები." },
  { href: "/admin/portfolio", title: "პორტფოლიო", description: "პროექტების დამატება, რედაქტირება და წაშლა." },
  { href: "/admin/courses", title: "კურსები", description: "კურსების მენეჯერი და Curriculum Builder — სექციები, გაკვეთილები, ვიდეო და PDF." },
  { href: "/admin/patterns", title: "თარგები", description: "თარგების (PDF) მენეჯერი — ფოტოები, ფასი, ფაილი." },
  { href: "/admin/students", title: "მოსწავლეები", description: "მოსწავლეთა პროგრესი და კურსებზე წვდომის მართვა." },
  { href: "/admin/sales", title: "გაყიდვები", description: "შემოსავლების ანალიტიკა — კურსები და თარგები, BOG / TBC." },
  { href: "/admin/verifications", title: "გადახდის დადასტურება", description: "ბანკში გადარიცხვის ქვითრები — დადასტურება ან უარყოფა." },
  { href: "/admin/settings", title: "საიტის პარამეტრები", description: "საიტის სახელი, სლოგანი, ტელეფონი, ელ. ფოსტა, სოციალური ბმულები." },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-text-primary">კონტენტი</h1>
      <p className="mt-2 text-text-muted">აირჩიეთ განყოფილება რედაქტირებისთვის.</p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CARDS.map((card) => (
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
