import { Link } from "@tanstack/react-router";
import { FileText, Timer, ClipboardList } from "lucide-react";
import { t } from "@/lib/copy";
import type { Locale } from "@/lib/types";

export function HomePage({ locale }: { locale: Locale }) {
  const c = t(locale);

  return (
    <main>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.2fr_0.8fr] md:py-20">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-stamp uppercase">{c.brand}</p>
          <h1 className="mt-3 max-w-xl font-display text-4xl font-semibold text-ink md:text-5xl">
            {c.heroTitle}
          </h1>
          <p className="mt-5 max-w-xl text-base text-ink-soft">{c.heroSub}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/$locale/change-order"
              params={{ locale }}
              className="inline-flex min-h-11 items-center justify-center rounded-[10px] bg-forest px-5 text-sm font-medium text-forest-ink"
            >
              {c.heroCta}
            </Link>
            <Link
              to="/$locale/tm-ticket"
              params={{ locale }}
              className="inline-flex min-h-11 items-center justify-center rounded-[10px] border border-line bg-card px-5 text-sm font-medium"
            >
              {c.heroTm}
            </Link>
            <Link
              to="/$locale/examples"
              params={{ locale }}
              className="inline-flex min-h-11 items-center justify-center px-3 text-sm font-medium text-ink-soft"
            >
              {c.heroSecondary}
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted">{c.relation}</p>
        </div>
        <aside className="rounded-[22px] border border-line bg-card p-5 shadow-paper">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">{c.samplePdf}</p>
          <div className="mt-3 aspect-[210/297] rounded-[14px] border border-line bg-paper p-5 text-[11px] leading-relaxed">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Prima16</span>
              <span className="border border-stamp px-1 text-[9px] tracking-wider text-stamp">{c.stamp}</span>
            </div>
            <p className="mt-4 font-display text-lg">{locale === "bg" ? "Допълнително възлагане" : "Change order"}</p>
            <p className="mt-1 text-muted">{locale === "bg" ? "ДВ-2026-019 · 6 сеп 2026" : "CO-2026-014 · 6 Sep 2026"}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-[8px] border border-line p-2">
                <p className="text-[9px] text-muted">{c.fieldContractor}</p>
                <p>{locale === "bg" ? "Строй-Плюс ЕООД" : "Northline Electrical"}</p>
              </div>
              <div className="rounded-[8px] border border-line p-2">
                <p className="text-[9px] text-muted">{c.fieldClient}</p>
                <p>{locale === "bg" ? "Яворов ап. 12" : "Harbour View"}</p>
              </div>
            </div>
            <div className="mt-4 space-y-1 border-t border-line pt-3">
              <div className="flex justify-between"><span>{locale === "bg" ? "Гипсокартон" : "Emergency bulkheads"}</span><span>€392.00</span></div>
              <div className="flex justify-between"><span>{locale === "bg" ? "Труд" : "Labour"}</span><span>€352.00</span></div>
            </div>
            <p className="mt-4 text-right font-medium">{locale === "bg" ? "Нова стойност €13 144.00" : "Revised €29 660.00"}</p>
            <p className="mt-6 text-[9px] text-muted">{c.footerPdf}</p>
          </div>
        </aside>
      </section>

      <section className="border-t border-line bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
          {[
            { icon: ClipboardList, t: c.how1t, d: c.how1d },
            { icon: FileText, t: c.how2t, d: c.how2d },
            { icon: Timer, t: c.how3t, d: c.how3d },
          ].map((item) => (
            <div key={item.t}>
              <item.icon className="size-5 text-forest" />
              <h2 className="mt-3 font-display text-xl">{item.t}</h2>
              <p className="mt-2 text-sm text-ink-soft">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-2">
        <Link
          to="/$locale/change-order"
          params={{ locale }}
          className="rounded-[22px] border border-line bg-card p-6 shadow-paper"
        >
          <h2 className="font-display text-2xl">{c.coCardT}</h2>
          <p className="mt-2 text-sm text-ink-soft">{c.coCardD}</p>
        </Link>
        <Link
          to="/$locale/tm-ticket"
          params={{ locale }}
          className="rounded-[22px] border border-line bg-card p-6 shadow-paper"
        >
          <h2 className="font-display text-2xl">{c.tmCardT}</h2>
          <p className="mt-2 text-sm text-ink-soft">{c.tmCardD}</p>
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-display text-2xl">{c.notTitle}</h2>
        <ul className="mt-4 grid gap-2 text-sm text-ink-soft md:grid-cols-2">
          {c.notItems.map((item) => (
            <li key={item} className="rounded-[14px] border border-line bg-card px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
