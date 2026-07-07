// Placeholder content for the Gallery page.
// TODO: replace with real photos (Firebase Storage) once assets exist.

export type GalleryPhoto = {
  id: string;
  caption: string;
  size: "sm" | "md" | "lg";
};

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
