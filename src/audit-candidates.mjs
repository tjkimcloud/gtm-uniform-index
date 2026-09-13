import { readFile } from "node:fs/promises";
import { parseCsv } from "./lib/csv.mjs";
import { selectLeadershipRoster } from "./lib/roster.mjs";

const inputPath = process.argv[2];
if (!inputPath) throw new Error("Usage: npm run audit -- <candidates.csv>");

const candidates = parseCsv(await readFile(inputPath, "utf8"));
const result = selectLeadershipRoster(candidates, 8);
console.log(JSON.stringify(result, null, 2));

