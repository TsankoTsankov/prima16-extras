import { Link, useRouterState } from "@tanstack/react-router";
import { t } from "@/lib/copy";
import { switchPath } from "@/lib/locale";
import type { Locale } from "@/lib/types";

function localeFromPath(pathname: string): Locale {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  return "bg";
}

export function SiteFrame({ children, locale }: { children: React.ReactNode; locale?: Locale }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const loc = locale ?? localeFromPath(pathname);
  const c = t(loc);

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="border-b border-line bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          {loc === "en" ? (
            <Link to="/$locale" params={{ locale: "en" }} className="flex items-center gap-2 no-underline text-ink">
              <span className="font-display text-lg font-semibold tracking-tight">Prima16</span>
              <span className="rounded-[4px] border border-stamp px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-stamp">
                {c.stamp}
              </span>
            </Link>
          ) : (
            <Link to="/" className="flex items-center gap-2 no-underline text-ink">
              <span className="font-display text-lg font-semibold tracking-tight">Prima16</span>
              <span className="rounded-[4px] border border-stamp px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-stamp">
                {c.stamp}
              </span>
            </Link>
          )}
          <nav className="hidden items-center gap-4 text-sm text-ink-soft md:flex">
            <Link to="/$locale/change-order" params={{ locale: loc }}>
              {c.navChange}
            </Link>
            <Link to="/$locale/tm-ticket" params={{ locale: loc }}>
              {c.navTm}
            </Link>
            <Link to="/$locale/examples" params={{ locale: loc }}>
              {c.navExamples}
            </Link>
            <Link to="/$locale/pricing" params={{ locale: loc }}>
              {c.navPricing}
            </Link>
            <Link to="/app">{c.navJobs}</Link>
          </nav>
          <div className="flex items-center gap-2 text-xs font-medium">
            <a href={switchPath(pathname, "bg")} className={loc === "bg" ? "text-ink" : "text-muted"}>
              {c.langBg}
            </a>
            <span className="text-line">/</span>
            <a href={switchPath(pathname, "en")} className={loc === "en" ? "text-ink" : "text-muted"}>
              {c.langEn}
            </a>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-4 pb-3 text-xs text-ink-soft md:hidden">
          <Link to="/$locale/change-order" params={{ locale: loc }} className="whitespace-nowrap">
            {c.navChange}
          </Link>
          <Link to="/$locale/tm-ticket" params={{ locale: loc }} className="whitespace-nowrap">
            {c.navTm}
          </Link>
          <Link to="/$locale/pricing" params={{ locale: loc }} className="whitespace-nowrap">
            {c.navPricing}
          </Link>
          <Link to="/app" className="whitespace-nowrap">
            {c.navJobs}
          </Link>
        </div>
      </header>
      <div className="min-h-[70dvh]">{children}</div>
      <footer className="border-t border-line bg-paper-2">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-ink-soft md:flex-row md:justify-between">
          <div className="max-w-md">
            <p>{c.footerFamily}</p>
            <p className="mt-2">
              <a href="https://prima16.com" className="text-forest underline-offset-2 hover:underline">
                prima16.com
              </a>
              {" · "}
              <a href="https://docs.prima16.com" className="underline-offset-2 hover:underline">
                Документи
              </a>
            </p>
            <p className="mt-3 text-xs text-muted">{c.relation}</p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            <Link to="/$locale/faq" params={{ locale: loc }}>
              {c.navFaq}
            </Link>
            <Link to="/$locale/vs-excel" params={{ locale: loc }}>
              {c.vsTitle}
            </Link>
            <Link to="/$locale/legal/$page" params={{ locale: loc, page: "terms" }}>
              {c.legalTerms}
            </Link>
            <Link to="/$locale/legal/$page" params={{ locale: loc, page: "privacy" }}>
              {c.legalPrivacy}
            </Link>
            <Link to="/$locale/legal/$page" params={{ locale: loc, page: "disclaimer" }}>
              {c.legalDisclaimer}
            </Link>
            <Link to="/$locale/legal/$page" params={{ locale: loc, page: "refunds" }}>
              {c.legalRefunds}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
