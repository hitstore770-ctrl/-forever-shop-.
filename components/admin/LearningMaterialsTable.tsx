import type { Kuntres } from "@/lib/learning-data";

// Reuses the same getKuntresim() data source as the public /learning page.
export default function LearningMaterialsTable({ items }: { items: Kuntres[] }) {
  return (
    <div className="overflow-x-auto border-4 border-black shadow-brutal-lg">
      <table className="w-full min-w-[640px] border-collapse text-right">
        <thead>
          <tr className="border-b-4 border-black bg-navy-900 text-cream">
            <th className="px-4 py-3 text-sm font-semibold uppercase">כותרת</th>
            <th className="px-4 py-3 text-sm font-semibold uppercase">מחבר</th>
            <th className="px-4 py-3 text-sm font-semibold uppercase">תאריך</th>
            <th className="px-4 py-3 text-sm font-semibold uppercase">קטגוריה</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={item.id}
              className={`border-b-2 border-black last:border-b-0 ${index % 2 === 0 ? "bg-cream" : "bg-cream-dark"}`}
            >
              <td className="px-4 py-3 font-semibold text-navy-950">{item.title}</td>
              <td className="px-4 py-3 font-normal text-navy-700/80">{item.author}</td>
              <td className="px-4 py-3 font-normal text-navy-700/80">{item.date}</td>
              <td className="px-4 py-3">
                <span className="inline-block border-2 border-black bg-copper-300 px-2 py-1 text-xs font-semibold text-navy-950 uppercase">
                  {item.category}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
