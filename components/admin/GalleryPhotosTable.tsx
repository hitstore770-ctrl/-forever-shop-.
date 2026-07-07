import { CameraIcon } from "@/components/icons";
import type { GalleryPhoto } from "@/lib/gallery-data";

const SIZE_LABEL: Record<GalleryPhoto["size"], string> = { sm: "קטן", md: "בינוני", lg: "גדול" };

// Read-only for now — lists the same static photos the public /gallery
// page renders. TODO next phase: back this with a Firestore collection +
// Firebase Storage uploads, and add create/edit/delete here.
export default function GalleryPhotosTable({ photos }: { photos: GalleryPhoto[] }) {
  return (
    <div className="overflow-x-auto border-4 border-black shadow-brutal-lg">
      <table className="w-full min-w-[560px] border-collapse text-right">
        <thead>
          <tr className="border-b-4 border-black bg-navy-900 text-cream">
            <th className="px-4 py-3 text-sm font-semibold uppercase">תצוגה</th>
            <th className="px-4 py-3 text-sm font-semibold uppercase">כיתוב</th>
            <th className="px-4 py-3 text-sm font-semibold uppercase">גודל</th>
          </tr>
        </thead>
        <tbody>
          {photos.map((photo, index) => (
            <tr
              key={photo.id}
              className={`border-b-2 border-black last:border-b-0 ${index % 2 === 0 ? "bg-cream" : "bg-cream-dark"}`}
            >
              <td className="px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center border-2 border-black bg-navy-900 text-cream">
                  <CameraIcon className="h-5 w-5" />
                </span>
              </td>
              <td className="px-4 py-3 font-semibold text-navy-950">{photo.caption}</td>
              <td className="px-4 py-3 font-normal text-navy-700/80">{SIZE_LABEL[photo.size]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
