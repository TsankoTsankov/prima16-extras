import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteFrame } from "@/components/site-frame";
import { documentNet, formatMoney } from "@/lib/money";
import { loadJob, loadPricebook } from "@/lib/storage";
import type { PricebookItem, SavedJob } from "@/lib/types";

export const Route = createFileRoute("/app")({
  component: AppHome,
});

function AppHome() {
  const [job, setJob] = useState<SavedJob | null>(null);
  const [book, setBook] = useState<PricebookItem[]>([]);
  useEffect(() => {
    setJob(loadJob());
    setBook(loadPricebook());
  }, []);

  const running =
    job &&
    (job.originalContractCents ?? 0) +
      job.finalizedDocs.reduce((sum, item) => sum + documentNet(item.lines, item.kind), 0);

  return (
    <SiteFrame locale="bg">
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-4xl">Обект в този браузър</h1>
        <p className="mt-3 text-ink-soft">
          Без облачен акаунт в тази версия. Черновите не пипат сумата. Финалните я пипат.
        </p>
        {!job ? (
          <p className="mt-8 text-muted">Няма запазен обект. Запази го от формуляра.</p>
        ) : (
          <section className="mt-8 rounded-[22px] border border-line bg-card p-5">
            <h2 className="font-display text-2xl">{job.name}</h2>
            <p className="mt-2 text-sm text-ink-soft">{job.site}</p>
            <p className="mt-4 text-sm">
              Нова стойност:{" "}
              <span className="tabular-nums font-medium">
                {formatMoney(running ?? 0, job.currency, "bg")}
              </span>
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {job.finalizedDocs.map((doc) => (
                <li key={doc.id} className="flex justify-between border-t border-line pt-2">
                  <span>
                    {doc.number} · {doc.date}
                  </span>
                  <span className="tabular-nums">
                    {formatMoney(documentNet(doc.lines, doc.kind), doc.currency, "bg")}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="mt-8">
          <h2 className="font-display text-2xl">Ценоразпис</h2>
          {book.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Празен.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {book.map((item) => (
                <li key={item.id} className="flex justify-between border-b border-line py-2">
                  <span>
                    {item.description} · {item.unit}
                  </span>
                  <span className="tabular-nums">{formatMoney(item.unitCents, "EUR", "bg")}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <div className="mt-8 flex gap-3">
          <Link
            to="/$locale/change-order"
            params={{ locale: "bg" }}
            className="rounded-[10px] bg-forest px-4 py-2.5 text-sm text-forest-ink"
          >
            Нов протокол
          </Link>
          <Link
            to="/$locale/tm-ticket"
            params={{ locale: "bg" }}
            className="rounded-[10px] border border-line px-4 py-2.5 text-sm"
          >
            Труд и материали
          </Link>
        </div>
      </main>
    </SiteFrame>
  );
}
