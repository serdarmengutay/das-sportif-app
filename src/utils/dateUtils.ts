/**
 * Tarih yardımcı fonksiyonları.
 */

export const formatDate = (ts: number | null): string => {
  if (!ts) return "Belirtilmedi";
  const d = new Date(ts);
  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const formatTime = (ts: number | null): string => {
  if (!ts) return "Belirtilmedi";
  const d = new Date(ts);
  return d.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
