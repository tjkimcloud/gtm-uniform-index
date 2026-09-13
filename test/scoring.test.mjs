import test from "node:test";
import assert from "node:assert/strict";
import { clothingCohort, derive, summarizeCompanies } from "../src/lib/scoring.mjs";

const base = {
  company: "ExampleCo",
  usable_image: true,
  suit_or_blazer: false,
  button_down: false,
  tie: false,
  vest: false,
  vest_type: "none",
  quarter_zip: false,
  sweater: false,
  polo: false,
  hoodie: false,
  tshirt: false,
  blouse_or_professional_top: false,
  dress_or_jumpsuit: false,
  traditional_formalwear: false,
  outerwear: false,
  outerwear_type: "none",
  branded_apparel: false,
  visible_brand: null,
  dominant_color: "other",
  primary_formality: "casual"
};

test("cohort precedence is deterministic", () => {
  assert.equal(clothingCohort({ ...base, vest: true, button_down: true, suit_or_blazer: true }), "Deal Room Uniform");
  assert.equal(clothingCohort({ ...base, quarter_zip: true, suit_or_blazer: true }), "Quarter-Zip Operator");
  assert.equal(clothingCohort({ ...base, suit_or_blazer: true, hoodie: true }), "Boardroom Classic");
  assert.equal(clothingCohort({ ...base, hoodie: true, tshirt: true }), "Startup Uniform");
  assert.equal(clothingCohort({ ...base, outerwear: true, outerwear_type: "puffer" }), "Outerwear Operator");
  assert.equal(clothingCohort({ ...base, blouse_or_professional_top: true }), "Corporate Casual");
  assert.equal(clothingCohort(base), "Relaxed Professional");
});

test("company uniform strength uses only the dominant cohort", () => {
  const rows = [
    derive({ ...base, tshirt: true }),
    derive({ ...base, tshirt: true }),
    derive({ ...base, quarter_zip: true }),
    derive({ ...base, button_down: true })
  ];

  const summary = summarizeCompanies(rows)[0];
  assert.equal(summary.dominant_cohort, "Founder Casual");
  assert.equal(summary.uniform_strength, 50);
});

test("scores remain inside 0 to 100", () => {
  const formal = derive({ ...base, suit_or_blazer: true, tie: true, button_down: true, traditional_formalwear: true });
  const casual = derive({ ...base, hoodie: true, tshirt: true, outerwear: true, outerwear_type: "puffer" });
  for (const row of [formal, casual]) {
    assert.ok(row.formality_score >= 0 && row.formality_score <= 100);
    assert.ok(row.founder_casual_score >= 0 && row.founder_casual_score <= 100);
    assert.ok(row.deal_room_energy >= 0 && row.deal_room_energy <= 100);
  }
});

