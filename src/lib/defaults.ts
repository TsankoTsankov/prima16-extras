import { nextDocNumber, todayISO, uid } from "./ids";
import type { ExtraDocument, Locale, DocType, LineItem } from "./types";

export function emptyLine(): LineItem {
  return { id: uid("ln"), description: "", qty: 1, unit: "бр", unitCents: 0 };
}

export function blankDocument(locale: Locale, type: DocType): ExtraDocument {
  return {
    id: uid("doc"),
    type,
    locale,
    paper: "A4",
    currency: "EUR",
    number: nextDocNumber(type, locale),
    date: todayISO(),
    kind: type === "tm_ticket" ? "add" : "add",
    reason: "",
    scheduleImpact: "",
    contractor: { name: "", details: "" },
    client: { name: "", details: "" },
    site: "",
    contractRef: "",
    originalContractCents: null,
    previousExtrasCents: 0,
    lines: [emptyLine()],
    notes: "",
    status: "draft",
    jobId: null,
    updatedAt: new Date().toISOString(),
  };
}

export const examples = {
  electrical: (): ExtraDocument => ({
    ...blankDocument("en", "change_order"),
    number: "CO-2026-014",
    contractor: {
      name: "Northline Electrical Ltd",
      details: "14 Quay Road, Bristol · Co. no. 12490811 · +44 117 000 000",
    },
    client: { name: "Harbour View Developments", details: "Site office, Cumberland Basin" },
    site: "Harbour View, Block C — risers 3–4",
    contractRef: "HV-E-2026-09",
    originalContractCents: 2840000,
    previousExtrasCents: 126000,
    reason: "Client instructed additional emergency lighting on the second-floor corridor after the first-fix inspection.",
    scheduleImpact: "Two working days. No change to handover date if access is given Monday.",
    lines: [
      { id: "a", description: "Emergency bulkheads, self-contained, 3h", qty: 8, unit: "nr", unitCents: 6200 },
      { id: "b", description: "2.5mm² LSF twin & earth, clipped", qty: 45, unit: "m", unitCents: 280 },
      { id: "c", description: "Labour — certified electrician", qty: 12, unit: "h", unitCents: 4500 },
    ],
  }),
  plumbing: (): ExtraDocument => ({
    ...blankDocument("en", "change_order"),
    number: "CO-2026-021",
    contractor: { name: "Penev Plumbing", details: "Sofia · ЕИК 204112233 · +359 88 000 000" },
    client: { name: "Residences Lozenets", details: "ул. Фритьоф Нансен 12" },
    site: "Lozenets, apt. 7 — wet rooms",
    contractRef: "LZ-P-18",
    originalContractCents: 960000,
    previousExtrasCents: 0,
    kind: "add",
    reason: "Move the towel rail and add a second basin waste on the ensuite after the client changed the vanity.",
    scheduleImpact: "One day. Tied to tiling hold.",
    lines: [
      { id: "a", description: "16mm MLCP, fittings included", qty: 9, unit: "m", unitCents: 1800 },
      { id: "b", description: "Chrome bottle trap 32mm", qty: 1, unit: "nr", unitCents: 2400 },
      { id: "c", description: "Plumber", qty: 6, unit: "h", unitCents: 3200 },
    ],
  }),
  hvac: (): ExtraDocument => ({
    ...blankDocument("en", "change_order"),
    number: "CO-2026-033",
    contractor: { name: "Klimatik Plus EOOD", details: "Пловдив · ЕИК 175009001" },
    client: { name: "Office Park Trakia", details: "Building B, 3rd floor" },
    site: "Trakia B / open office",
    contractRef: "TR-HVAC-3",
    originalContractCents: 4120000,
    previousExtrasCents: 84000,
    reason: "Add one extra indoor unit on the west facade after the partition plan changed.",
    scheduleImpact: "Three days for pipework and vacuum. Commissioning stays on the original Friday.",
    lines: [
      { id: "a", description: "Wall indoor unit 3.5kW, supply only", qty: 1, unit: "nr", unitCents: 78000 },
      { id: "b", description: "Refrigerant pipe pair + insulation", qty: 18, unit: "m", unitCents: 2100 },
      { id: "c", description: "Install & commission", qty: 1, unit: "ls", unitCents: 36000 },
    ],
  }),
  remodel: (): ExtraDocument => ({
    ...blankDocument("en", "change_order"),
    number: "CO-2026-040",
    kind: "deduct",
    contractor: { name: "Atelier Room", details: "Varna" },
    client: { name: "Private client", details: "Sea Garden apartment" },
    site: "Sea Garden remodel — kitchen",
    contractRef: "SG-REM-2",
    originalContractCents: 1580000,
    previousExtrasCents: 45000,
    reason: "Omit the island lighting grid. Client will supply pendants later.",
    scheduleImpact: "None.",
    lines: [
      { id: "a", description: "Island lighting grid, labour and containment", qty: 1, unit: "ls", unitCents: 22000 },
    ],
  }),
  tm: (): ExtraDocument => ({
    ...blankDocument("en", "tm_ticket"),
    number: "TM-2026-008",
    contractor: { name: "Balkan Fit-out", details: "Sofia" },
    client: { name: "Retail landlord", details: "Mall unit 14" },
    site: "Unit 14 — after-hours snag",
    contractRef: "U14-open",
    originalContractCents: null,
    previousExtrasCents: 0,
    reason: "Call-out to rebuild a collapsed plasterboard return after a leak. T&M as instructed by the site manager.",
    scheduleImpact: "Worked 22:00–02:00. Unit opens at 10:00.",
    lines: [
      { id: "a", description: "Night labour — two operatives", qty: 8, unit: "h", unitCents: 3800 },
      { id: "b", description: "12.5mm plasterboard", qty: 6, unit: "m²", unitCents: 900 },
      { id: "c", description: "Metal stud offcuts + fixings", qty: 1, unit: "ls", unitCents: 1800 },
    ],
  }),
  bgChange: (): ExtraDocument => ({
    ...blankDocument("bg", "change_order"),
    number: "ДВ-2026-019",
    contractor: {
      name: "Строй-Плюс ЕООД",
      details: "гр. София, ул. Оборище 8 · ЕИК 201234567 · +359 888 111 222",
    },
    client: { name: "Жилищна сграда „Яворов“", details: "ет. 4, ап. 12, ул. Яворов 3" },
    site: "София, Яворов — мокри помещения ап. 12",
    contractRef: "ОФ-2026-44",
    originalContractCents: 1250000,
    previousExtrasCents: 0,
    reason: "Възложителят поиска допълнителна стена от гипсокартон след преместване на вратата към спалнята.",
    scheduleImpact: "Два работни дни. Крайният срок по договора не се променя при достъп в сряда.",
    lines: [
      { id: "a", description: "Гипсокартон 12.5 мм, двоен лист", qty: 14, unit: "м²", unitCents: 2800 },
      { id: "b", description: "Метална конструкция UW/CW", qty: 18, unit: "м", unitCents: 900 },
      { id: "c", description: "Труд — двама работника", qty: 16, unit: "ч", unitCents: 2200 },
    ],
  }),
};

export const exampleIndex = [
  { slug: "electrical-change-order", locale: "en" as const, title: "Electrical change order", make: examples.electrical },
  { slug: "plumbing-change-order", locale: "en" as const, title: "Plumbing change order", make: examples.plumbing },
  { slug: "hvac-change-order", locale: "en" as const, title: "HVAC change order", make: examples.hvac },
  { slug: "remodel-change-order", locale: "en" as const, title: "Remodel change order", make: examples.remodel },
  { slug: "tm-ticket", locale: "en" as const, title: "T&M ticket", make: examples.tm },
  { slug: "dopalnitelni-raboti", locale: "bg" as const, title: "Протокол допълнителни работи", make: examples.bgChange },
];
