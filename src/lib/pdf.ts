import { documentNet, formatMoney, lineTotal, revisedTotal } from "./money";
import { t } from "./copy";
import type { ExtraDocument } from "./types";

const MM = 2.83465;

function pageSize(paper: ExtraDocument["paper"]) {
  if (paper === "Letter") return { w: 215.9 * MM, h: 279.4 * MM, cssW: 816, cssH: 1056 };
  return { w: 210 * MM, h: 297 * MM, cssW: 794, cssH: 1123 };
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines: string[] = [];
  let current = words[0];
  for (let i = 1; i < words.length; i++) {
    const test = `${current} ${words[i]}`;
    if (ctx.measureText(test).width <= maxWidth) current = test;
    else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);
  return lines;
}

export function drawDocument(doc: ExtraDocument, clean: boolean): HTMLCanvasElement {
  const size = pageSize(doc.paper);
  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = size.cssW * scale;
  canvas.height = size.cssH * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.scale(scale, scale);
  const W = size.cssW;
  const H = size.cssH;
  const c = t(doc.locale);
  const ink = "#1a1714";
  const muted = "#6b635a";
  const line = "#cfc6b6";
  const forest = "#3f5a4c";
  const stamp = "#7a3b2e";

  ctx.fillStyle = "#fbf8f2";
  ctx.fillRect(0, 0, W, H);

  const m = 48;
  ctx.strokeStyle = line;
  ctx.strokeRect(28, 28, W - 56, H - 56);

  ctx.fillStyle = forest;
  ctx.font = "600 13px 'Source Sans 3', sans-serif";
  ctx.fillText("PRIMA16", m, 58);
  ctx.fillStyle = stamp;
  ctx.font = "600 10px 'Source Sans 3', sans-serif";
  ctx.fillText(c.stamp, m + 68, 58);

  ctx.fillStyle = muted;
  ctx.font = "400 11px 'Source Sans 3', sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(doc.paper === "Letter" ? "Letter" : "A4", W - m, 58);
  ctx.textAlign = "left";

  const title = doc.type === "change_order" ? c.formTitleCo : c.formTitleTm;
  ctx.fillStyle = ink;
  ctx.font = "600 26px 'Source Serif 4', Georgia, serif";
  ctx.fillText(title, m, 96);

  ctx.font = "500 13px 'Source Sans 3', sans-serif";
  ctx.fillText(`${c.fieldNumber}: ${doc.number}`, m, 122);
  ctx.fillText(`${c.fieldDate}: ${doc.date}`, m + 260, 122);
  if (doc.type === "change_order") {
    const kind =
      doc.kind === "deduct" ? c.kindDeduct : doc.kind === "schedule" ? c.kindSchedule : c.kindAdd;
    ctx.fillText(`${c.fieldKind}: ${kind}`, m + 460, 122);
  }

  const y0 = 148;
  box(ctx, m, y0, 330, 88, c.fieldContractor, doc.contractor.name, doc.contractor.details, ink, muted, line);
  box(ctx, m + 350, y0, 330, 88, c.fieldClient, doc.client.name, doc.client.details, ink, muted, line);

  ctx.fillStyle = muted;
  ctx.font = "500 10px 'Source Sans 3', sans-serif";
  ctx.fillText(c.fieldSite.toUpperCase(), m, y0 + 114);
  ctx.fillStyle = ink;
  ctx.font = "500 14px 'Source Sans 3', sans-serif";
  ctx.fillText(doc.site || "—", m, y0 + 134);
  ctx.fillStyle = muted;
  ctx.font = "400 12px 'Source Sans 3', sans-serif";
  ctx.fillText(`${c.fieldContract}: ${doc.contractRef || "—"}`, m + 350, y0 + 134);

  let y = y0 + 162;
  ctx.fillStyle = muted;
  ctx.font = "500 10px 'Source Sans 3', sans-serif";
  ctx.fillText(c.fieldReason.toUpperCase(), m, y);
  ctx.fillStyle = ink;
  ctx.font = "400 13px 'Source Sans 3', sans-serif";
  y += 18;
  for (const row of wrapText(ctx, doc.reason || "—", W - m * 2)) {
    ctx.fillText(row, m, y);
    y += 18;
  }
  if (doc.scheduleImpact) {
    y += 6;
    ctx.fillStyle = muted;
    ctx.font = "500 10px 'Source Sans 3', sans-serif";
    ctx.fillText(c.fieldSchedule.toUpperCase(), m, y);
    y += 16;
    ctx.fillStyle = ink;
    ctx.font = "400 13px 'Source Sans 3', sans-serif";
    for (const row of wrapText(ctx, doc.scheduleImpact, W - m * 2)) {
      ctx.fillText(row, m, y);
      y += 18;
    }
  }

  y += 10;
  ctx.fillStyle = forest;
  ctx.fillRect(m, y, W - m * 2, 26);
  ctx.fillStyle = "#f3eee4";
  ctx.font = "600 11px 'Source Sans 3', sans-serif";
  ctx.fillText(c.colDesc, m + 10, y + 17);
  ctx.fillText(c.colQty, m + 390, y + 17);
  ctx.fillText(c.colUnit, m + 450, y + 17);
  ctx.fillText(c.colPrice, m + 520, y + 17);
  ctx.fillText(c.colTotal, m + 620, y + 17);
  y += 26;

  const rows = doc.lines.filter((l) => l.description.trim() || l.unitCents || l.qty);
  rows.forEach((line, i) => {
    if (i % 2 === 0) {
      ctx.fillStyle = "#f0eadc";
      ctx.fillRect(m, y - 4, W - m * 2, 22);
    }
    ctx.fillStyle = ink;
    ctx.font = "400 12px 'Source Sans 3', sans-serif";
    ctx.fillText(line.description.slice(0, 48) || "—", m + 10, y + 12);
    ctx.fillText(String(line.qty), m + 390, y + 12);
    ctx.fillText(line.unit, m + 450, y + 12);
    ctx.fillText(formatMoney(line.unitCents, doc.currency, doc.locale), m + 520, y + 12);
    ctx.fillText(formatMoney(lineTotal(line.qty, line.unitCents), doc.currency, doc.locale), m + 620, y + 12);
    y += 22;
  });

  const net = documentNet(doc.lines, doc.kind);
  y += 8;
  ctx.font = "600 14px 'Source Sans 3', sans-serif";
  ctx.fillStyle = ink;
  ctx.textAlign = "right";
  ctx.fillText(`${c.recThis}: ${formatMoney(net, doc.currency, doc.locale)}`, W - m, y + 12);
  ctx.textAlign = "left";
  y += 28;

  const revised = revisedTotal(doc.originalContractCents, doc.previousExtrasCents, net);
  if (doc.originalContractCents !== null && revised !== null) {
    ctx.strokeStyle = line;
    ctx.strokeRect(m, y, W - m * 2, 78);
    ctx.fillStyle = muted;
    ctx.font = "500 10px 'Source Sans 3', sans-serif";
    ctx.fillText(c.recTitle.toUpperCase(), m + 12, y + 16);
    ctx.fillStyle = ink;
    ctx.font = "400 13px 'Source Sans 3', sans-serif";
    ctx.fillText(`${c.recOriginal}: ${formatMoney(doc.originalContractCents, doc.currency, doc.locale)}`, m + 12, y + 36);
    ctx.fillText(`${c.recPrev}: ${formatMoney(doc.previousExtrasCents, doc.currency, doc.locale)}`, m + 12, y + 54);
    ctx.fillText(`${c.recThis}: ${formatMoney(net, doc.currency, doc.locale)}`, m + 280, y + 36);
    ctx.font = "600 14px 'Source Sans 3', sans-serif";
    ctx.fillText(`${c.recRevised}: ${formatMoney(revised, doc.currency, doc.locale)}`, m + 280, y + 56);
    y += 90;
  }

  if (doc.notes) {
    ctx.fillStyle = muted;
    ctx.font = "500 10px 'Source Sans 3', sans-serif";
    ctx.fillText(c.fieldNotes.toUpperCase(), m, y);
    y += 16;
    ctx.fillStyle = ink;
    ctx.font = "400 12px 'Source Sans 3', sans-serif";
    for (const row of wrapText(ctx, doc.notes, W - m * 2)) {
      ctx.fillText(row, m, y);
      y += 16;
    }
  }

  ctx.fillStyle = muted;
  ctx.font = "400 11px 'Source Sans 3', sans-serif";
  ctx.fillText("________________________", m, H - 118);
  ctx.fillText(c.fieldContractor, m, H - 102);
  ctx.fillText("________________________", m + 280, H - 118);
  ctx.fillText(c.fieldClient, m + 280, H - 102);

  ctx.fillStyle = muted;
  ctx.font = "400 10px 'Source Sans 3', sans-serif";
  const disc = wrapText(ctx, c.disclaimer, W - m * 2);
  disc.forEach((row, i) => ctx.fillText(row, m, H - 78 + i * 13));

  if (!clean) {
    ctx.fillStyle = stamp;
    ctx.font = "500 10px 'Source Sans 3', sans-serif";
    ctx.fillText(c.footerPdf, m, H - 44);
  }

  ctx.fillStyle = "#9a9184";
  ctx.font = "400 9px 'Source Sans 3', sans-serif";
  ctx.fillText(doc.status === "final" ? "FINAL" : "DRAFT", W - m - 40, H - 44);

  return canvas;
}

function box(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  name: string,
  details: string,
  ink: string,
  muted: string,
  line: string,
) {
  ctx.strokeStyle = line;
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = muted;
  ctx.font = "500 10px 'Source Sans 3', sans-serif";
  ctx.fillText(label.toUpperCase(), x + 10, y + 16);
  ctx.fillStyle = ink;
  ctx.font = "600 14px 'Source Sans 3', sans-serif";
  ctx.fillText(name || "—", x + 10, y + 38);
  ctx.fillStyle = muted;
  ctx.font = "400 11px 'Source Sans 3', sans-serif";
  const rows = wrapText(ctx, details || "", w - 20);
  rows.slice(0, 2).forEach((row, i) => ctx.fillText(row, x + 10, y + 56 + i * 14));
}

function jpegData(canvas: HTMLCanvasElement): Uint8Array {
  const dataUrl = canvas.toDataURL("image/jpeg", 0.86);
  const b64 = dataUrl.split(",")[1] ?? "";
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export function canvasToPdf(canvas: HTMLCanvasElement, paper: ExtraDocument["paper"]): Blob {
  const { w, h } = pageSize(paper);
  const img = jpegData(canvas);
  const objects: string[] = [];
  const xref: number[] = [0];

  const imgObj =
    `<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} ` +
    `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.length} >>`;

  const parts: (string | Uint8Array)[] = [];
  const push = (s: string) => parts.push(s);

  push("%PDF-1.4\n");
  const mark = () => {
    let offset = 0;
    for (const p of parts) offset += typeof p === "string" ? p.length : p.length;
    return offset;
  };

  xref.push(mark());
  push("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n");
  xref.push(mark());
  push("2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n");
  xref.push(mark());
  push(
    `3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w.toFixed(2)} ${h.toFixed(2)}] ` +
      `/Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >> endobj\n`,
  );
  xref.push(mark());
  push(`4 0 obj ${imgObj}\nstream\n`);
  parts.push(img);
  push("\nendstream endobj\n");
  const content = `q ${w.toFixed(2)} 0 0 ${h.toFixed(2)} 0 0 cm /Im0 Do Q`;
  xref.push(mark());
  push(`5 0 obj << /Length ${content.length} >> stream\n${content}\nendstream endobj\n`);

  const startxref = mark();
  push(`xref\n0 6\n0000000000 65535 f \n`);
  for (let i = 1; i <= 5; i++) {
    push(`${String(xref[i]).padStart(10, "0")} 00000 n \n`);
  }
  push(`trailer << /Size 6 /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF`);

  const total = parts.reduce((n, p) => n + (typeof p === "string" ? p.length : p.length), 0);
  const out = new Uint8Array(total);
  let o = 0;
  for (const p of parts) {
    if (typeof p === "string") {
      for (let i = 0; i < p.length; i++) out[o++] = p.charCodeAt(i) & 0xff;
    } else {
      out.set(p, o);
      o += p.length;
    }
  }
  void objects;
  return new Blob([out], { type: "application/pdf" });
}

export function downloadPdf(doc: ExtraDocument, clean: boolean) {
  const canvas = drawDocument(doc, clean);
  const blob = canvasToPdf(canvas, doc.paper);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${doc.number.replace(/\s/g, "_")}.pdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
