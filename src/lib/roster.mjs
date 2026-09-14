import { readFileSync } from "node:fs";

const policy = JSON.parse(
  readFileSync(new URL("../../config/leadership-policy.json", import.meta.url), "utf8")
);

export const seniorityWeights = Object.freeze({ ...policy.seniorityWeights });
export const functionWeights = Object.freeze({ ...policy.functionWeights });
export const coverageOrder = Object.freeze([...policy.coverageOrder]);
export const requiredPeoplePerCompany = policy.requiredPeoplePerCompany;

export function asBoolean(value) {
  if (typeof value === "boolean") return value;
  return ["true", "1", "yes", "y"].includes(String(value ?? "").trim().toLowerCase());
}

export function classifySeniority(title = "") {
  const value = title.toLowerCase();
  if (/\bfounder\b|\bco[- ]?founder\b|\bchief\b|\bceo\b|\bcro\b|\bcmo\b|\bcto\b|\bcoo\b|\bcpo\b/.test(value)) {
    return "founder_or_c_suite";
  }
  if (/\bpresident\b|\bevp\b|executive vice president|\bsvp\b|senior vice president/.test(value)) {
    return "president_evp_svp";
  }
  if (/\bvp\b|vice president/.test(value)) return "vp";
  if (/\bhead of\b|^head\b/.test(value)) return "head";
  if (/\bdirector\b/.test(value)) return "director";
  return "individual_contributor";
}

export function classifyFunction(title = "") {
  const value = title.toLowerCase();
  if (/founder|chief executive|\bceo\b/.test(value)) return "founder_ceo";
  if (/revenue operations|revops|gtm (strategy|operations|engineering)|go[- ]to[- ]market operations|marketing operations/.test(value)) return "gtm_operations";
  if (/chief revenue|\bcro\b|\bsales\b|revenue leader|enterprise revenue/.test(value)) return "revenue_sales";
  if (/marketing|\bcmo\b|demand generation/.test(value)) return "marketing";
  if (/growth|partnership/.test(value)) return "growth_partnerships";
  if (/customer|client experience|customer success/.test(value)) return "customer";
  if (/product|technology|engineering|\bcto\b|\bcpo\b/.test(value)) return "product_technology";
  if (/operations|strategy|\bcoo\b/.test(value)) return "operations_strategy";
  if (/people|human resources|\bhr\b/.test(value)) return "people";
  if (/finance|financial|\bcfo\b/.test(value)) return "finance";
  if (/legal|counsel/.test(value)) return "legal";
  return "other";
}

export function scoreCandidate(candidate) {
  const seniority_tier = classifySeniority(candidate.title);
  const leadership_function = classifyFunction(candidate.title);
  return {
    ...candidate,
    seniority_tier,
    leadership_function,
    selection_score: seniorityWeights[seniority_tier] + functionWeights[leadership_function]
  };
}

export function qualificationFailures(candidate) {
  const failures = [];
  if (!asBoolean(candidate.current_employment_verified)) failures.push("current employment not verified");
  if (!asBoolean(candidate.leadership_relevance_verified)) failures.push("leadership relevance not verified");
  if (!candidate.profile_url) failures.push("profile URL missing");
  if (String(candidate.photo_source_type).toLowerCase() !== "linkedin") failures.push("photo source is not LinkedIn");
  if (String(candidate.clothing_visibility).toLowerCase() !== "pass") failures.push("clothing visibility failed");
  return failures;
}

function candidateOrder(a, b) {
  return b.selection_score - a.selection_score || a.person_name.localeCompare(b.person_name);
}

export function selectLeadershipRoster(candidates, requiredPeople = requiredPeoplePerCompany) {
  const scored = candidates.map(scoreCandidate);
  const seenProfiles = new Set();
  const eligible = [];
  const rejected = [];

  for (const candidate of scored) {
    const failures = qualificationFailures(candidate);
    if (candidate.seniority_tier === "individual_contributor") failures.push("below leadership seniority gate");
    if (seenProfiles.has(candidate.profile_url)) failures.push("duplicate profile");
    if (candidate.profile_url) seenProfiles.add(candidate.profile_url);

    if (failures.length) rejected.push({ ...candidate, audit_status: "rejected", audit_reason: failures.join("; ") });
    else eligible.push(candidate);
  }

  const selected = [];
  for (const leadershipFunction of coverageOrder) {
    const best = eligible
      .filter((candidate) => candidate.leadership_function === leadershipFunction && !selected.includes(candidate))
      .sort(candidateOrder)[0];
    if (best && selected.length < requiredPeople) selected.push(best);
  }

  for (const candidate of eligible.filter((item) => !selected.includes(item)).sort(candidateOrder)) {
    if (selected.length >= requiredPeople) break;
    selected.push(candidate);
  }

  const selectedSet = new Set(selected);
  const qualifiedNotSelected = eligible
    .filter((candidate) => !selectedSet.has(candidate))
    .map((candidate) => ({ ...candidate, audit_status: "alternate", audit_reason: "qualified alternate after coverage and score ordering" }));

  return {
    selected: selected.map((candidate) => ({ ...candidate, audit_status: "selected", audit_reason: "selected by coverage and score policy" })),
    alternates: qualifiedNotSelected,
    rejected,
    complete: selected.length === requiredPeople
  };
}
