import test from "node:test";
import assert from "node:assert/strict";
import { normalizeClassification, validateClassification } from "../src/lib/classification.mjs";

test("normalization removes guessed brands and impossible garment subtypes", () => {
  const output = normalizeClassification({
    usable_image: "true",
    confidence: 94,
    vest: false,
    vest_type: "puffer",
    outerwear: false,
    outerwear_type: "jacket",
    branded_apparel: false,
    visible_brand: "Patagonia",
    dominant_color: "navy",
    primary_formality: "business_casual",
    background_type: "plain"
  });

  assert.equal(output.vest_type, "none");
  assert.equal(output.outerwear_type, "none");
  assert.equal(output.visible_brand, null);
  assert.deepEqual(validateClassification(output), []);
});

test("a blazer is not also counted as generic outerwear", () => {
  const output = normalizeClassification({
    usable_image: true,
    confidence: 90,
    suit_or_blazer: true,
    outerwear: true,
    outerwear_type: "jacket",
    dominant_color: "black",
    primary_formality: "formal",
    background_type: "studio"
  });

  assert.equal(output.outerwear, false);
  assert.equal(output.outerwear_type, "none");
  assert.deepEqual(validateClassification(output), []);
});

