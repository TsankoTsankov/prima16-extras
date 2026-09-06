import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { exampleIndex } from "@/lib/defaults";
import { parseLocale } from "@/lib/locale";
import { saveDraft } from "@/lib/storage";
import { t } from "@/lib/copy";
import { formatMoney, documentNet } from "@/lib/money";

export const Route = createFileRoute("/$locale/examples/$slug")({
  component: Page,
});

function Page() {
  const { slug, locale: raw } = Route.useParams();
  const locale = parseLocale(raw);
  const entry = exampleIndex.find((item) => item.slug === slug) ?? exampleIndex[0];
  const doc = entry.make();
  const c = t(locale);
  const target = doc.type === "tm_ticket" ? "/$locale/tm-ticket" : "/$locale/change-order";

  useEffect(() => {
    saveDraft({ ...doc, locale, status: "draft" });
  }, [doc, locale]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs font-semibold tracking-wide text-stamp uppercase">{c.examplesTitle}</p>
      <h1 className="mt-2 font-display text-4xl">{entry.title}</h1>
      <p className="mt-4 text-ink-soft">{doc.reason}</p>
      <dl className="mt-6 grid gap-2 text-sm">
        <div className="flex justify-between gap-4 border-b border-line py-2">
          <dt>{c.fieldSite}</dt>
          <dd>{doc.site}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-line py-2">
          <dt>{c.recThis}</dt>
          <dd>{formatMoney(documentNet(doc.lines, doc.kind), doc.currency, locale)}</dd>
        </div>
      </dl>
      <Link
        to={target}
        params={{ locale }}
        className="mt-8 inline-flex min-h-11 items-center rounded-[10px] bg-forest px-5 text-sm font-medium text-forest-ink"
      >
        {c.loadSample}
      </Link>
    </main>
  );
}
