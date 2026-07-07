// Shared formatting helpers.

// Formats a Date as "DD/MM/YYYY" — the display format used across the admin
// dashboard's data tables.
export function formatDateDMY(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}
