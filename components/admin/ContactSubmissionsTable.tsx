import type { ContactSubmission } from "@/lib/admin-data";

// Table for visit-request submissions from the "Join Us" form.
// TODO: back this with real submissions once VisitForm posts to Firestore
// instead of just being local UI state.
export default function ContactSubmissionsTable({ submissions }: { submissions: ContactSubmission[] }) {
  return (
    <div className="overflow-x-auto border-4 border-black shadow-brutal-lg">
      <table className="w-full min-w-[560px] border-collapse text-right">
        <thead>
          <tr className="border-b-4 border-black bg-navy-900 text-cream">
            <th className="px-4 py-3 text-sm font-semibold uppercase">תאריך פנייה</th>
            <th className="px-4 py-3 text-sm font-semibold uppercase">שם</th>
            <th className="px-4 py-3 text-sm font-semibold uppercase">טלפון</th>
            <th className="px-4 py-3 text-sm font-semibold uppercase">תאריך ביקור מבוקש</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission, index) => (
            <tr
              key={submission.id}
              className={`border-b-2 border-black last:border-b-0 ${index % 2 === 0 ? "bg-cream" : "bg-cream-dark"}`}
            >
              <td className="px-4 py-3 font-normal text-navy-700/80">{submission.date}</td>
              <td className="px-4 py-3 font-semibold text-navy-950">{submission.name}</td>
              <td className="px-4 py-3 font-normal text-navy-700/80">{submission.phone}</td>
              <td className="px-4 py-3 font-normal text-navy-700/80">{submission.preferredDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
