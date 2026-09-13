import { readFile } from "node:fs/promises";
import { parseCsv } from "./lib/csv.mjs";
import { normalizeClassification } from "./lib/classification.mjs";
import { selectLeadershipRoster } from "./lib/roster.mjs";
import { derive, summarizeCompanies } from "./lib/scoring.mjs";

const candidates = parseCsv(await readFile(new URL("../examples/synthetic-candidates.csv", import.meta.url), "utf8"));
const classifications = parseCsv(await readFile(new URL("../examples/synthetic-classifications.csv", import.meta.url), "utf8"));

const roster = selectLeadershipRoster(candidates, 8);
const scored = classifications.map((row) => derive({ ...row, ...normalizeClassification(row) }));

console.log(JSON.stringify({
  roster: {
    complete: roster.complete,
    selected: roster.selected.map(({ person_name, title, seniority_tier, leadership_function, selection_score }) => ({
      person_name, title, seniority_tier, leadership_function, selection_score
    })),
    rejected: roster.rejected.map(({ person_name, title, audit_reason }) => ({ person_name, title, audit_reason }))
  },
  companySummary: summarizeCompanies(scored)
}, null, 2));

