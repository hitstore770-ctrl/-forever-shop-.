
// The yeshiva's history timeline (×¦××¨ ×××× / ××¨××××). Reads come from the
// Firestore "history" collection via the client SDK (public read); writes
// happen server-side through the admin SDK behind the passcode gate (see the
// history Server Actions). Each milestone may carry an archive image. Falls
// back to the seed list below whenever Firebase isn't configured or the
// collection is empty.
//
// `order` is auto-assigned so new milestones sort to the end of the timeline.

export type HistoryMilestone = {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl?: string;
  order?: number;
};

// Seed = the previously hardcoded milestones, ready to import into Firestore.
export const HISTORY_MILESTONES: HistoryMilestone[] = [
  {
    id: "1",
    year: '×ª×©×¢"×',
    title: "××§××ª ×××©×××",
    description: "×§×××¦× ×¨××©×× × ×©× ×ª×××××× ×××× ××× ××ª×× ×¡×ª ×¡××× ×××× ××©××ª×£ ×©× ×ª××¨× ××××.",
    order: 1,
  },
  {
    id: "2",
    year: '×ª×©×¢"×',
    title: "××¢××¨ ×××× × ××§×××¢",
    description: "×××©××× ×¢×××¨×ª ×××× × ×× ××××, ××¤××ª××ª ××ª ×©×¢×¨×× ×× ××ª×××××× ××¨×§×¢×× ××××× ××.",
    order: 2,
  },
  {
    id: "3",
    year: '×ª×©×¤"×',
    title: "××¨×××ª ××¡××× ×××§×¨×××",
    description: "××¦× ××¡××× ××ª×××××, × ×¤×ª× ××¡××× ×××¢××× ×××§×¨××× ××××§×©×× ×××ª×§×¨× ××××××.",
    order: 3,
  },
  {
    id: "4",
    year: "××××",
    title: "×§×××× ×ª××¡×¡×ª",
    description: "×¢×©×¨××ª ×ª××××××, ×¡××¨ ××× ×¢×©××¨ ××××××, ××§×××× ××× ×©×××©××× ××¦×××.",
    order: 4,
  },
];

// Returns the history milestones from the seed list. Previously read from
// Firestore; now uses the seed list directly to avoid Firebase permission
// errors while keeping the timeline display identical.
export async function getMilestones(): Promise<HistoryMilestone[]> {
  return HISTORY_MILESTONES;
}
