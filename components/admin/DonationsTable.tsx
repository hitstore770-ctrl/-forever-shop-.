import type { DonationRecord, PaymentStatus } from "@/lib/admin-data";

const STATUS_STYLE: Record<PaymentStatus, string> = {
  שולם: "bg-copper-400 text-navy-950",
  ממתין: "bg-cream-dark text-navy-900",
  נכשל: "bg-red-600 text-cream",
};

export default function DonationsTable({ donations }: { donations: DonationRecord[] }) {
  return (
    <div className="overflow-x-auto border-4 border-black shadow-brutal-lg">
      <table className="w-full min-w-[720px] border-collapse text-right">
        <thead>
          <tr className="border-b-4 border-black bg-navy-900 text-cream">
            <th className="px-4 py-3 text-sm font-semibold uppercase">תאריך</th>
            <th className="px-4 py-3 text-sm font-semibold uppercase">שם התורם</th>
            <th className="px-4 py-3 text-sm font-semibold uppercase">סוג הקדשה</th>
            <th className="px-4 py-3 text-sm font-semibold uppercase">סכום</th>
            <th className="px-4 py-3 text-sm font-semibold uppercase">סטטוס תשלום</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation, index) => (
            <tr
              key={donation.id}
              className={`border-b-2 border-black last:border-b-0 ${index % 2 === 0 ? "bg-cream" : "bg-cream-dark"}`}
            >
              <td className="px-4 py-3 font-normal text-navy-900">{donation.date}</td>
              <td className="px-4 py-3 font-semibold text-navy-950">{donation.donorName}</td>
              <td className="px-4 py-3 font-normal text-navy-700/80">{donation.tier}</td>
              <td className="px-4 py-3 font-semibold text-navy-950">₪{donation.amount}</td>
              <td className="px-4 py-3">
                <span className={`inline-block border-2 border-black px-2 py-1 text-xs font-semibold uppercase ${STATUS_STYLE[donation.status]}`}>
                  {donation.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
