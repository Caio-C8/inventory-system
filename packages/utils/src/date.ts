export function formatDate(date: string | Date | null | undefined) {
  if (!date) return "-";

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return "-";

  return dateObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
