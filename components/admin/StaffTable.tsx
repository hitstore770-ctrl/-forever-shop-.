import { UserIcon } from "@/components/icons";
import type { StaffMember } from "@/lib/contact-data";

// Read-only for now — lists the same static staff the public Contact and
// Yeshiva pages render. TODO next phase: back this with a Firestore
// collection + Firebase Storage photo uploads, and add create/edit/delete.
export default function StaffTable({ staff }: { staff: StaffMember[] }) {
  return (
    <div className="overflow-x-auto border-4 border-black shadow-brutal-lg">
      <table className="w-full min-w-[640px] border-collapse text-right">
        <thead>
          <tr className="border-b-4 border-black bg-navy-900 text-cream">
            <th className="px-4 py-3 text-sm font-semibold uppercase">תמונה</th>
            <th className="px-4 py-3 text-sm font-semibold uppercase">שם</th>
            <th className="px-4 py-3 text-sm font-semibold uppercase">תפקיד</th>
            <th className="px-4 py-3 text-sm font-semibold uppercase">ביוגרפיה</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member, index) => (
            <tr
              key={member.id}
              className={`border-b-2 border-black last:border-b-0 ${index % 2 === 0 ? "bg-cream" : "bg-cream-dark"}`}
            >
              <td className="px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center border-2 border-black bg-navy-900 text-cream">
                  <UserIcon className="h-5 w-5" />
                </span>
              </td>
              <td className="px-4 py-3 font-semibold text-navy-950">{member.name}</td>
              <td className="px-4 py-3 font-normal text-navy-700/80">{member.role}</td>
              <td className="max-w-xs px-4 py-3 truncate font-normal text-navy-700/80">{member.bio ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
