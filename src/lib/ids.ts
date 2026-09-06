export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function nextDocNumber(type: "change_order" | "tm_ticket", locale: "bg" | "en"): string {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 80) + 12).padStart(3, "0");
  if (type === "tm_ticket") return locale === "bg" ? `ТМ-${year}-${seq}` : `TM-${year}-${seq}`;
  return locale === "bg" ? `ДВ-${year}-${seq}` : `CO-${year}-${seq}`;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}
