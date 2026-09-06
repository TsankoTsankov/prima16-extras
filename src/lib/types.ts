export type Locale = "bg" | "en";
export type DocType = "change_order" | "tm_ticket";
export type ChangeKind = "add" | "deduct" | "schedule";
export type Paper = "A4" | "Letter";
export type Currency = "EUR" | "GBP" | "USD";
export type DocStatus = "draft" | "final";

export type LineItem = {
  id: string;
  description: string;
  qty: number;
  unit: string;
  unitCents: number;
};

export type Party = {
  name: string;
  details: string;
};

export type ExtraDocument = {
  id: string;
  type: DocType;
  locale: Locale;
  paper: Paper;
  currency: Currency;
  number: string;
  date: string;
  kind: ChangeKind;
  reason: string;
  scheduleImpact: string;
  contractor: Party;
  client: Party;
  site: string;
  contractRef: string;
  originalContractCents: number | null;
  previousExtrasCents: number;
  lines: LineItem[];
  notes: string;
  status: DocStatus;
  jobId: string | null;
  updatedAt: string;
};

export type SavedJob = {
  id: string;
  name: string;
  site: string;
  contractRef: string;
  originalContractCents: number | null;
  currency: Currency;
  finalizedDocs: ExtraDocument[];
};

export type PricebookItem = {
  id: string;
  description: string;
  unit: string;
  unitCents: number;
};

export type Unlocks = {
  changeOrder: boolean;
  tmTicket: boolean;
  device: boolean;
};

export type Usage = {
  month: string;
  finalizedCount: number;
};
