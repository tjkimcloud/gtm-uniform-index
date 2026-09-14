import test from "node:test";
import assert from "node:assert/strict";
import {
  classifyFunction,
  classifySeniority,
  coverageOrder,
  functionWeights,
  requiredPeoplePerCompany,
  scoreCandidate,
  seniorityWeights,
  selectLeadershipRoster
} from "../src/lib/roster.mjs";

const qualified = (person_name, title) => ({
  company: "ExampleCo",
  person_name,
  title,
  current_employment_verified: true,
  leadership_relevance_verified: true,
  profile_url: `https://example.com/${person_name.toLowerCase().replaceAll(" ", "-")}`,
  photo_source_type: "linkedin",
  clothing_visibility: "pass"
});

test("runtime roster policy is loaded from the public configuration", () => {
  assert.equal(requiredPeoplePerCompany, 8);
  assert.equal(seniorityWeights.founder_or_c_suite, 100);
  assert.equal(functionWeights.marketing, 90);
  assert.deepEqual(coverageOrder.slice(0, 3), ["founder_ceo", "revenue_sales", "marketing"]);
});

test("seniority ladder separates executives from individual contributors", () => {
  assert.equal(classifySeniority("Chief Marketing Officer"), "founder_or_c_suite");
  assert.equal(classifySeniority("SVP of Revenue"), "president_evp_svp");
  assert.equal(classifySeniority("VP of Sales"), "vp");
  assert.equal(classifySeniority("Head of Growth"), "head");
  assert.equal(classifySeniority("Account Executive"), "individual_contributor");
});

test("GTM relevance prefers a CMO to a VP of Legal", () => {
  const cmo = scoreCandidate(qualified("Marketing", "Chief Marketing Officer"));
  const legal = scoreCandidate(qualified("Legal", "VP of Legal"));
  assert.equal(classifyFunction(cmo.title), "marketing");
  assert.equal(classifyFunction(legal.title), "legal");
  assert.ok(cmo.selection_score > legal.selection_score);
});

test("selection favors functional coverage and excludes account executives", () => {
  const candidates = [
    qualified("Founder", "Co-Founder and CEO"),
    qualified("Revenue", "Chief Revenue Officer"),
    qualified("Marketing", "Chief Marketing Officer"),
    qualified("GTM Ops", "VP of GTM Operations"),
    qualified("Growth", "Head of Growth"),
    qualified("Customer", "Chief Customer Officer"),
    qualified("Product", "Chief Product Officer"),
    qualified("Operations", "SVP of Operations"),
    qualified("Legal", "VP of Legal"),
    qualified("Seller", "Account Executive")
  ];

  const result = selectLeadershipRoster(candidates, 8);
  assert.equal(result.complete, true);
  assert.equal(result.selected.length, 8);
  assert.equal(result.selected.some((candidate) => candidate.person_name === "Legal"), false);
  assert.equal(result.rejected.some((candidate) => candidate.person_name === "Seller"), true);
  assert.equal(new Set(result.selected.map((candidate) => candidate.leadership_function)).size, 8);
});

test("qualification gates route unusable photos to rejection", () => {
  const candidate = { ...qualified("No Photo", "Chief Revenue Officer"), clothing_visibility: "fail" };
  const result = selectLeadershipRoster([candidate], 1);
  assert.equal(result.complete, false);
  assert.match(result.rejected[0].audit_reason, /clothing visibility failed/);
});
