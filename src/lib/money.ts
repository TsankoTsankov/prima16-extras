import type { Currency } from "./types";

export function parseMoneyToCents(raw: string): number {
  const cleaned = raw.replace(/\s/g, "").replace(",", ".");
  if (!cleaned) return 0;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

export function centsToInput(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function formatMoney(cents: number, currency: Currency, locale: "bg" | "en"): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const major = Math.floor(abs / 100);
  const minor = String(abs % 100).padStart(2, "0");
  const grouped = locale === "bg"
    ? String(major).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    : String(major).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const symbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : "€";
  return `${sign}${symbol}${grouped}.${minor}`;
}

export function lineTotal(qty: number, unitCents: number): number {
  return Math.round(qty * unitCents);
}

export function documentNet(lines: { qty: number; unitCents: number }[], kind: "add" | "deduct" | "schedule"): number {
  if (kind === "schedule") return 0;
  const sum = lines.reduce((acc, line) => acc + lineTotal(line.qty, line.unitCents), 0);
  return kind === "deduct" ? -sum : sum;
}

export function revisedTotal(
  original: number | null,
  previousExtras: number,
  thisDoc: number,
): number | null {
  if (original === null) return null;
  return original + previousExtras + thisDoc;
}
