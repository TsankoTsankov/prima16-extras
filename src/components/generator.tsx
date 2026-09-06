import { useEffect, useMemo, useState } from "react";
import { t } from "@/lib/copy";
import { blankDocument, emptyLine, examples } from "@/lib/defaults";
import { centsToInput, documentNet, formatMoney, lineTotal, parseMoneyToCents, revisedTotal } from "@/lib/money";
import { downloadPdf } from "@/lib/pdf";
import {
  isClean,
  loadContractor,
  loadDraft,
  loadJob,
  loadPricebook,
  loadUnlocks,
  loadUsage,
  saveContractor,
  saveDraft,
  saveJob,
  savePricebook,
  saveUnlocks,
  saveUsage,
} from "@/lib/storage";
import { uid } from "@/lib/ids";
import type { Currency, DocType, ExtraDocument, Locale, Paper, SavedJob } from "@/lib/types";
import { Button, Field, Input, Select, Textarea } from "./ui";

export function Generator({ locale, type }: { locale: Locale; type: DocType }) {
  const c = t(locale);
  const [doc, setDoc] = useState<ExtraDocument>(() => blankDocument(locale, type));
  const [unlocks, setUnlocks] = useState(loadUnlocks());
  const [usage, setUsage] = useState(loadUsage());
  const [job, setJob] = useState<SavedJob | null>(null);
  const [book, setBook] = useState(loadPricebook());
  const [payOpen, setPayOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const stored = loadDraft();
    const contractor = loadContractor();
    if (stored && stored.type === type) {
      setDoc({ ...stored, locale });
    } else {
      setDoc((d) => ({
        ...d,
        locale,
        type,
        contractor: contractor.name ? contractor : d.contractor,
        lines: d.lines.length ? d.lines : [emptyLine()],
      }));
    }
    setJob(loadJob());
    setUnlocks(loadUnlocks());
    setUsage(loadUsage());
    setBook(loadPricebook());
  }, [locale, type]);

  useEffect(() => {
    saveDraft(doc);
    if (doc.contractor.name) saveContractor(doc.contractor);
  }, [doc]);

  const net = useMemo(() => documentNet(doc.lines, doc.kind), [doc.lines, doc.kind]);
  const revised = revisedTotal(doc.originalContractCents, doc.previousExtrasCents, net);
  const clean = isClean(type, unlocks);
  const quotaLeft = Math.max(0, 2 - usage.finalizedCount);

  function patch(partial: Partial<ExtraDocument>) {
    setDoc((d) => ({ ...d, ...partial, updatedAt: new Date().toISOString() }));
  }

  function loadExample() {
    const sample =
      type === "tm_ticket"
        ? locale === "bg"
          ? { ...examples.tm(), locale: "bg" as const, number: "ТМ-2026-008" }
          : examples.tm()
        : locale === "bg"
          ? examples.bgChange()
          : examples.electrical();
    setDoc({ ...sample, locale, type, status: "draft", id: uid("doc") });
  }

  function applyJobTotals(next: ExtraDocument) {
    if (!job) return next;
    const prev = job.finalizedDocs.reduce((sum, item) => sum + documentNet(item.lines, item.kind), 0);
    return {
      ...next,
      jobId: job.id,
      site: next.site || job.site,
      contractRef: next.contractRef || job.contractRef,
      originalContractCents: job.originalContractCents,
      previousExtrasCents: prev,
      currency: job.currency,
    };
  }

  function finalizeAndDownload() {
    if (!clean && quotaLeft <= 0) {
      setNotice(c.quotaBlock);
      setPayOpen(true);
      return;
    }
    const ready = applyJobTotals({ ...doc, status: "final" });
    setDoc(ready);
    downloadPdf(ready, clean);
    const nextUsage = { ...usage, finalizedCount: usage.finalizedCount + (clean ? 0 : 1) };
    if (!clean) {
      setUsage(nextUsage);
      saveUsage(nextUsage);
    }
    if (job) {
      const updated: SavedJob = {
        ...job,
        finalizedDocs: [...job.finalizedDocs.filter((d) => d.id !== ready.id), ready],
      };
      setJob(updated);
      saveJob(updated);
    }
    setNotice(clean ? c.footerOff : c.footerOn);
  }

  function justDownload() {
    downloadPdf(applyJobTotals(doc), clean);
  }

  function attachJob() {
    const current =
      job ??
      ({
        id: uid("job"),
        name: doc.site || (locale === "bg" ? "Обект" : "Job"),
        site: doc.site,
        contractRef: doc.contractRef,
        originalContractCents: doc.originalContractCents,
        currency: doc.currency,
        finalizedDocs: [],
      } satisfies SavedJob);
    const nextJob = {
      ...current,
      site: doc.site || current.site,
      contractRef: doc.contractRef || current.contractRef,
      originalContractCents: doc.originalContractCents,
      currency: doc.currency,
    };
    setJob(nextJob);
    saveJob(nextJob);
    patch({ jobId: nextJob.id });
    setNotice(locale === "bg" ? "Обектът е в този браузър." : "Job file stored in this browser.");
  }

  function pay(kind: "one" | "all") {
    const next = {
      ...unlocks,
      changeOrder: kind === "all" || type === "change_order" ? true : unlocks.changeOrder,
      tmTicket: kind === "all" || type === "tm_ticket" ? true : unlocks.tmTicket,
      device: kind === "all" ? true : unlocks.device,
    };
    setUnlocks(next);
    saveUnlocks(next);
    setPayOpen(false);
    setNotice(c.unlockDone);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div>
        <p className="text-xs font-semibold tracking-[0.16em] text-stamp uppercase">{c.brand}</p>
        <h1 className="mt-2 font-display text-3xl">{type === "change_order" ? c.formTitleCo : c.formTitleTm}</h1>
        <p className="mt-2 text-sm text-ink-soft">{c.heroSub}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <Field label={c.fieldNumber}>
            <Input value={doc.number} onChange={(e) => patch({ number: e.target.value })} />
          </Field>
          <Field label={c.fieldDate}>
            <Input type="date" value={doc.date} onChange={(e) => patch({ date: e.target.value })} />
          </Field>
          <Field label={c.fieldPaper}>
            <Select value={doc.paper} onChange={(e) => patch({ paper: e.target.value as Paper })}>
              <option>A4</option>
              <option>Letter</option>
            </Select>
          </Field>
          <Field label={c.fieldCurrency}>
            <Select value={doc.currency} onChange={(e) => patch({ currency: e.target.value as Currency })}>
              <option>EUR</option>
              <option>GBP</option>
              <option>USD</option>
            </Select>
          </Field>
        </div>

        {type === "change_order" && (
          <div className="mt-4">
            <Field label={c.fieldKind}>
              <Select value={doc.kind} onChange={(e) => patch({ kind: e.target.value as ExtraDocument["kind"] })}>
                <option value="add">{c.kindAdd}</option>
                <option value="deduct">{c.kindDeduct}</option>
                <option value="schedule">{c.kindSchedule}</option>
              </Select>
            </Field>
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label={c.fieldContractor}>
            <Input value={doc.contractor.name} onChange={(e) => patch({ contractor: { ...doc.contractor, name: e.target.value } })} />
          </Field>
          <Field label={c.fieldClient}>
            <Input value={doc.client.name} onChange={(e) => patch({ client: { ...doc.client, name: e.target.value } })} />
          </Field>
          <Field label={c.fieldDetails}>
            <Textarea value={doc.contractor.details} onChange={(e) => patch({ contractor: { ...doc.contractor, details: e.target.value } })} />
          </Field>
          <Field label={c.fieldDetails}>
            <Textarea value={doc.client.details} onChange={(e) => patch({ client: { ...doc.client, details: e.target.value } })} />
          </Field>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label={c.fieldSite}>
            <Input value={doc.site} onChange={(e) => patch({ site: e.target.value })} />
          </Field>
          <Field label={c.fieldContract}>
            <Input value={doc.contractRef} onChange={(e) => patch({ contractRef: e.target.value })} />
          </Field>
          <Field label={c.fieldOriginal}>
            <Input
              inputMode="decimal"
              value={doc.originalContractCents === null ? "" : centsToInput(doc.originalContractCents)}
              onChange={(e) =>
                patch({
                  originalContractCents: e.target.value.trim() === "" ? null : parseMoneyToCents(e.target.value),
                })
              }
            />
          </Field>
          <Field label={c.fieldPrev}>
            <Input
              inputMode="decimal"
              value={centsToInput(doc.previousExtrasCents)}
              onChange={(e) => patch({ previousExtrasCents: parseMoneyToCents(e.target.value) })}
            />
          </Field>
        </div>

        <div className="mt-4 grid gap-4">
          <Field label={c.fieldReason}>
            <Textarea value={doc.reason} onChange={(e) => patch({ reason: e.target.value })} />
          </Field>
          <Field label={c.fieldSchedule}>
            <Input value={doc.scheduleImpact} onChange={(e) => patch({ scheduleImpact: e.target.value })} />
          </Field>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl">{c.linesTitle}</h2>
            <Button variant="ghost" onClick={() => patch({ lines: [...doc.lines, emptyLine()] })}>
              {c.addLine}
            </Button>
          </div>
          <div className="mt-3 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted">
                  <th className="pb-2">{c.colDesc}</th>
                  <th className="pb-2 w-20">{c.colQty}</th>
                  <th className="pb-2 w-24">{c.colUnit}</th>
                  <th className="pb-2 w-28">{c.colPrice}</th>
                  <th className="pb-2 w-28">{c.colTotal}</th>
                </tr>
              </thead>
              <tbody>
                {doc.lines.map((line, index) => (
                  <tr key={line.id} className="align-top">
                    <td className="py-1 pr-2">
                      <Input
                        value={line.description}
                        onChange={(e) => {
                          const lines = doc.lines.slice();
                          lines[index] = { ...line, description: e.target.value };
                          patch({ lines });
                        }}
                      />
                    </td>
                    <td className="py-1 pr-2">
                      <Input
                        inputMode="decimal"
                        value={String(line.qty)}
                        onChange={(e) => {
                          const lines = doc.lines.slice();
                          lines[index] = { ...line, qty: Number(e.target.value) || 0 };
                          patch({ lines });
                        }}
                      />
                    </td>
                    <td className="py-1 pr-2">
                      <Input
                        value={line.unit}
                        onChange={(e) => {
                          const lines = doc.lines.slice();
                          lines[index] = { ...line, unit: e.target.value };
                          patch({ lines });
                        }}
                      />
                    </td>
                    <td className="py-1 pr-2">
                      <Input
                        inputMode="decimal"
                        value={centsToInput(line.unitCents)}
                        onChange={(e) => {
                          const lines = doc.lines.slice();
                          lines[index] = { ...line, unitCents: parseMoneyToCents(e.target.value) };
                          patch({ lines });
                        }}
                      />
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      {formatMoney(lineTotal(line.qty, line.unitCents), doc.currency, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 space-y-3 md:hidden">
            {doc.lines.map((line, index) => (
              <div key={line.id} className="rounded-[14px] border border-line bg-card p-3">
                <Field label={c.colDesc}>
                  <Input
                    value={line.description}
                    onChange={(e) => {
                      const lines = doc.lines.slice();
                      lines[index] = { ...line, description: e.target.value };
                      patch({ lines });
                    }}
                  />
                </Field>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Field label={c.colQty}>
                    <Input
                      inputMode="decimal"
                      value={String(line.qty)}
                      onChange={(e) => {
                        const lines = doc.lines.slice();
                        lines[index] = { ...line, qty: Number(e.target.value) || 0 };
                        patch({ lines });
                      }}
                    />
                  </Field>
                  <Field label={c.colUnit}>
                    <Input
                      value={line.unit}
                      onChange={(e) => {
                        const lines = doc.lines.slice();
                        lines[index] = { ...line, unit: e.target.value };
                        patch({ lines });
                      }}
                    />
                  </Field>
                  <Field label={c.colPrice}>
                    <Input
                      inputMode="decimal"
                      value={centsToInput(line.unitCents)}
                      onChange={(e) => {
                        const lines = doc.lines.slice();
                        lines[index] = { ...line, unitCents: parseMoneyToCents(e.target.value) };
                        patch({ lines });
                      }}
                    />
                  </Field>
                  <div className="flex flex-col justify-end pb-2 text-sm tabular-nums">
                    {formatMoney(lineTotal(line.qty, line.unitCents), doc.currency, locale)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {book.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-muted">{c.fromBook}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {book.map((item) => (
                  <button
                    key={item.id}
                    className="rounded-full border border-line bg-card px-3 py-1 text-xs"
                    onClick={() =>
                      patch({
                        lines: [
                          ...doc.lines,
                          { id: uid("ln"), description: item.description, qty: 1, unit: item.unit, unitCents: item.unitCents },
                        ],
                      })
                    }
                  >
                    {item.description}
                  </button>
                ))}
              </div>
            </div>
          )}
          <Button
            variant="quiet"
            className="mt-2"
            onClick={() => {
              const last = doc.lines[doc.lines.length - 1];
              if (!last?.description) return;
              const next = [...book, { id: uid("pb"), description: last.description, unit: last.unit, unitCents: last.unitCents }];
              setBook(next);
              savePricebook(next);
            }}
          >
            {c.saveBook}
          </Button>
        </div>

        <div className="mt-6 rounded-[22px] border border-line bg-card p-5">
          <h2 className="font-display text-lg">{c.recTitle}</h2>
          {doc.originalContractCents === null ? (
            <p className="mt-2 text-sm text-muted">{c.recHidden}</p>
          ) : (
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex justify-between gap-4"><dt>{c.recOriginal}</dt><dd className="tabular-nums">{formatMoney(doc.originalContractCents, doc.currency, locale)}</dd></div>
              <div className="flex justify-between gap-4"><dt>{c.recPrev}</dt><dd className="tabular-nums">{formatMoney(doc.previousExtrasCents, doc.currency, locale)}</dd></div>
              <div className="flex justify-between gap-4"><dt>{c.recThis}</dt><dd className="tabular-nums">{formatMoney(net, doc.currency, locale)}</dd></div>
              <div className="flex justify-between gap-4 font-medium"><dt>{c.recRevised}</dt><dd className="tabular-nums">{revised !== null ? formatMoney(revised, doc.currency, locale) : "—"}</dd></div>
            </dl>
          )}
        </div>

        <div className="mt-4">
          <Field label={c.fieldNotes}>
            <Textarea value={doc.notes} onChange={(e) => patch({ notes: e.target.value })} />
          </Field>
        </div>
      </div>

      <aside className="lg:sticky lg:top-6 h-fit rounded-[22px] border border-line bg-card p-5 shadow-paper">
        <p className="text-xs text-muted">{clean ? c.footerOff : c.footerOn}</p>
        <p className="mt-2 text-sm">
          {c.quota}: <span className="tabular-nums font-medium">{quotaLeft}/2</span>
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button onClick={finalizeAndDownload}>{c.finalize}</Button>
          <Button variant="ghost" onClick={justDownload}>{c.download}</Button>
          <Button variant="ghost" onClick={loadExample}>{c.loadSample}</Button>
          <Button variant="ghost" onClick={attachJob}>{c.saveJob}</Button>
          <Button
            variant="quiet"
            onClick={() => {
              const fresh = blankDocument(locale, type);
              const contractor = loadContractor();
              setDoc(contractor.name ? { ...fresh, contractor } : fresh);
            }}
          >
            {c.newDoc}
          </Button>
        </div>
        {!clean && (
          <div className="mt-5 border-t border-line pt-4">
            <p className="font-display text-lg">{c.unlockTitle}</p>
            <Button className="mt-3 w-full" variant="stamp" onClick={() => setPayOpen(true)}>
              {c.unlockOne}
            </Button>
            <Button className="mt-2 w-full" variant="ghost" onClick={() => setPayOpen(true)}>
              {c.unlockAll}
            </Button>
            <p className="mt-3 text-xs text-muted">{c.unlockNote}</p>
          </div>
        )}
        {job && (
          <div className="mt-5 border-t border-line pt-4 text-sm">
            <p className="font-medium">{c.jobTitle}</p>
            <p className="mt-1 text-ink-soft">{job.name}</p>
            <p className="mt-1 text-xs text-muted">
              {c.jobRevised}:{" "}
              {formatMoney(
                (job.originalContractCents ?? 0) +
                  job.finalizedDocs.reduce((sum, item) => sum + documentNet(item.lines, item.kind), 0),
                job.currency,
                locale,
              )}
            </p>
          </div>
        )}
        {notice && <p className="mt-4 text-sm text-ok">{notice}</p>}
      </aside>

      {payOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-[22px] border border-line bg-card p-6 shadow-paper">
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">Paddle.com</p>
            <h2 className="mt-2 font-display text-2xl">{c.unlockTitle}</h2>
            <p className="mt-2 text-sm text-ink-soft">{c.unlockNote}</p>
            <div className="mt-5 flex flex-col gap-2">
              <Button onClick={() => pay("one")}>{c.unlockOne} — {c.unlockDemo}</Button>
              <Button variant="ghost" onClick={() => pay("all")}>{c.unlockAll} — {c.unlockDemo}</Button>
              <Button variant="quiet" onClick={() => setPayOpen(false)}>
                {locale === "bg" ? "Затвори" : "Close"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
