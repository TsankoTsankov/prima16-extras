import type { Locale } from "./types";

export function parseLocale(value: string | undefined): Locale {
  return value === "en" ? "en" : "bg";
}

export function switchPath(pathname: string, next: Locale): string {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === "/" || clean === "/bg") return next === "en" ? "/en" : "/";
  if (clean.startsWith("/en/")) {
    const rest = clean.slice(4);
    return next === "en" ? `/en/${rest}` : `/bg/${rest}`;
  }
  if (clean === "/en") return next === "en" ? "/en" : "/";
  if (clean.startsWith("/bg/")) {
    const rest = clean.slice(4);
    return next === "bg" ? `/bg/${rest}` : `/en/${rest}`;
  }
  return next === "en" ? "/en" : "/";
}
