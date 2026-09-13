import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { parseCsv, toCsv } from "./lib/csv.mjs";
import { normalizeClassification } from "./lib/classification.mjs";
import { derive, summarizeCompanies } from "./lib/scoring.mjs";

const [inputPath, outputPath = "outputs/scored.csv", summaryPath = "outputs/company-summary.json"] = process.argv.slice(2);
if (!inputPath) throw new Error("Usage: npm run score -- <classified.csv> [scored.csv] [company-summary.json]");

const rows = parseCsv(await readFile(inputPath, "utf8")).map((row) => {
  const normalized = normalizeClassification(row);
  return derive({ ...row, ...normalized });
});

await mkdir(dirname(outputPath), { recursive: true });
await mkdir(dirname(summaryPath), { recursive: true });
await writeFile(outputPath, toCsv(rows), "utf8");
await writeFile(summaryPath, `${JSON.stringify(summarizeCompanies(rows), null, 2)}\n`, "utf8");
console.log(JSON.stringify({ rows: rows.length, outputPath, summaryPath }, null, 2));

