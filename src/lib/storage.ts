import { currentMonth } from "./ids";
import type {
  ExtraDocument,
  PricebookItem,
  SavedJob,
  Unlocks,
  Usage,
  Party,
} from "./types";

const KEYS = {
  draft: "prima16.extras.draft",
  job: "prima16.extras.job",
  pricebook: "prima16.extras.pricebook",
  unlocks: "prima16.extras.unlocks",
  usage: "prima16.extras.usage",
  contractor: "prima16.extras.contractor",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadDraft(): ExtraDocument | null {
  return read<ExtraDocument | null>(KEYS.draft, null);
}

export function saveDraft(doc: ExtraDocument) {
  write(KEYS.draft, doc);
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEYS.draft);
}

export function loadJob(): SavedJob | null {
  return read<SavedJob | null>(KEYS.job, null);
}

export function saveJob(job: SavedJob) {
  write(KEYS.job, job);
}

export function loadPricebook(): PricebookItem[] {
  return read<PricebookItem[]>(KEYS.pricebook, []);
}

export function savePricebook(items: PricebookItem[]) {
  write(KEYS.pricebook, items);
}

export function loadUnlocks(): Unlocks {
  return read<Unlocks>(KEYS.unlocks, {
    changeOrder: false,
    tmTicket: false,
    device: false,
  });
}

export function saveUnlocks(unlocks: Unlocks) {
  write(KEYS.unlocks, unlocks);
}

export function loadUsage(): Usage {
  const usage = read<Usage>(KEYS.usage, { month: currentMonth(), finalizedCount: 0 });
  const month = currentMonth();
  if (usage.month !== month) return { month, finalizedCount: 0 };
  return usage;
}

export function saveUsage(usage: Usage) {
  write(KEYS.usage, usage);
}

export function loadContractor(): Party {
  return read<Party>(KEYS.contractor, { name: "", details: "" });
}

export function saveContractor(party: Party) {
  write(KEYS.contractor, party);
}

export function isClean(type: "change_order" | "tm_ticket", unlocks: Unlocks): boolean {
  if (unlocks.device) return true;
  return type === "change_order" ? unlocks.changeOrder : unlocks.tmTicket;
}
