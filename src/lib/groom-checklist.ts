export type ChecklistStatus = "ok" | "reqd";

export interface ChecklistItemDef {
  key: string;
  label: string;
}

/** Mirrors the paper mirror-hanger checklist. */
export const GROOM_CHECKLIST_ITEMS: ChecklistItemDef[] = [
  { key: "cof", label: "COF" },
  { key: "rego", label: "REGO" },
  { key: "ruc", label: "RUC" },
  { key: "service", label: "SERVICE" },
  { key: "fuel", label: "FUEL" },
  { key: "tyres", label: "TYRES" },
  { key: "tools", label: "TOOLS" },
  { key: "spare_tyre", label: "SPARE TYRE" },
  { key: "groomed", label: "GROOMED" },
  { key: "wiper_blades_fluids", label: "WIPER BLADES/FLUIDS" },
  { key: "lights_horn", label: "LIGHTS/HORN" },
];

export type ChecklistItems = Record<string, ChecklistStatus | undefined>;

export function emptyChecklist(): ChecklistItems {
  return {};
}

export function hasIssues(items: ChecklistItems): boolean {
  return GROOM_CHECKLIST_ITEMS.some((i) => items[i.key] === "reqd");
}

export function issueLabels(items: ChecklistItems): string[] {
  return GROOM_CHECKLIST_ITEMS.filter((i) => items[i.key] === "reqd").map((i) => i.label);
}

export function isComplete(items: ChecklistItems): boolean {
  return GROOM_CHECKLIST_ITEMS.every((i) => items[i.key] === "ok" || items[i.key] === "reqd");
}
