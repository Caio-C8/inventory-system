export function formatDate(date: string | Date | null | undefined) {
  if (!date) return "-";

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC",
  }).format(dateObj);
}
