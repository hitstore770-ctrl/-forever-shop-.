import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";

// The yeshiva's photo gallery (גלריה). Reads come from the Firestore "gallery"
// collection via the client SDK (public read); writes (image upload + create/
// delete) happen server-side through the admin SDK behind the passcode gate
// (see the gallery Server Actions). Falls back to the caption-only seed below
// whenever Firebase isn't configured or the collection is empty, so the page
// still renders its "photo wall" layout before any real photos are uploaded.
//
// `order` is auto-assigned (newest first) — not a CMS field.

export type GalleryPhoto = {
  id: string;
  caption: string;
  size: "sm" | "md" | "lg";
  imageUrl?: string;
  order?: number;
};

// Seed = placeholder tiles (no imageUrl) so the layout has something to show
// before real photos exist.
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  { id: "1", caption: "התוועדות חנוכה", size: "lg" },
  { id: "2", caption: "סדר לימוד בוקר", size: "sm" },
  { id: "3", caption: "ריקודי שמחת תורה", size: "md" },
  { id: "4", caption: "טיול שנתי לצפון", size: "lg" },
  { id: "5", caption: "מסיבת חנוכה", size: "sm" },
  { id: "6", caption: "ערב שירה וניגונים", size: "md" },
  { id: "7", caption: "חלוקת קונטרסים", size: "sm" },
  { id: "8", caption: "התוועדות פורים", size: "lg" },
  { id: "9", caption: "יום ספורט", size: "md" },
];

// Reads the gallery from Firestore, newest first. Falls back to the seed list
// if Firebase isn't configured, the collection is empty, or the read fails.
export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  if (!isFirebaseConfigured || !db) {
    return GALLERY_PHOTOS;
  }

  try {
    const snapshot = await getDocs(query(collection(db, "gallery"), orderBy("order", "desc")));
    if (snapshot.empty) return GALLERY_PHOTOS;
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as GalleryPhoto);
  } catch (error) {
    console.warn("Failed to load gallery from Firestore, using seed data.", error);
    return GALLERY_PHOTOS;
  }
}
