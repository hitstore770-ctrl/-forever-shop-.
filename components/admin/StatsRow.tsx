import { DONATIONS_TABLE } from "@/lib/admin-data";

// TODO: once real data is wired up, filter by the actual current month
// instead of treating every placeholder row as "this month".
export default function StatsRow() {
  const paidDonations = DONATIONS_TABLE.filter((donation) => donation.status === "שולם");
  const totalAmount = paidDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const averageAmount = paidDonations.length > 0 ? Math.round(totalAmount / paidDonations.length) : 0;

  const stats = [
    { label: "סה״כ תרומות החודש", value: `₪${totalAmount.toLocaleString("he-IL")}`, accent: "bg-copper-400 text-navy-950" },
    { label: "מספר תרומות", value: String(paidDonations.length), accent: "bg-navy-900 text-cream" },
    { label: "תרומה ממוצעת", value: `₪${averageAmount}`, accent: "bg-cream-dark text-navy-900" },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className={`border-4 border-black p-6 shadow-brutal ${stat.accent}`}>
          <p className="text-xs font-semibold tracking-widest uppercase opacity-70">{stat.label}</p>
          <p className="mt-2 text-4xl font-semibold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
