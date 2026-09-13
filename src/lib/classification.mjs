export const booleanFields = [
  "usable_image", "suit_or_blazer", "button_down", "tie", "vest",
  "quarter_zip", "sweater", "polo", "hoodie", "tshirt",
  "blouse_or_professional_top", "dress_or_jumpsuit", "traditional_formalwear",
  "outerwear", "branded_apparel", "glasses"
];

const enums = {
  vest_type: ["puffer", "fleece", "quilted", "other", "none"],
  outerwear_type: ["puffer", "coat", "jacket", "overshirt", "shell", "other", "none"],
  dominant_color: ["black", "navy", "gray", "white", "blue", "other"],
  primary_formality: ["formal", "business_casual", "casual"],
  background_type: ["studio", "office", "outdoors", "event", "plain", "other"]
};

export function asBoolean(value) {
  if (typeof value === "boolean") return value;
  return ["true", "1", "yes", "y"].includes(String(value ?? "").trim().toLowerCase());
}

export function normalizeClassification(input) {
  const output = {};
  for (const field of booleanFields) output[field] = asBoolean(input[field]);
  output.confidence = Math.max(0, Math.min(100, Math.round(Number(input.confidence) || 0)));

  for (const [field, allowed] of Object.entries(enums)) {
    const value = String(input[field] ?? "other").toLowerCase();
    output[field] = allowed.includes(value) ? value : "other";
  }

  if (!output.vest) output.vest_type = "none";
  if (!output.outerwear) output.outerwear_type = "none";
  if (output.suit_or_blazer && output.outerwear) {
    output.outerwear = false;
    output.outerwear_type = "none";
  }

  output.visible_brand = input.visible_brand ? String(input.visible_brand).trim() : null;
  if (!output.branded_apparel) output.visible_brand = null;
  return output;
}

export function validateClassification(input) {
  const errors = [];
  for (const field of booleanFields) {
    if (typeof input[field] !== "boolean") errors.push(`${field} must be boolean`);
  }
  if (!Number.isInteger(input.confidence) || input.confidence < 0 || input.confidence > 100) {
    errors.push("confidence must be an integer from 0 to 100");
  }
  for (const [field, allowed] of Object.entries(enums)) {
    if (!allowed.includes(input[field])) errors.push(`${field} must be one of ${allowed.join(", ")}`);
  }
  if (!input.vest && input.vest_type !== "none") errors.push("vest_type must be none when vest=false");
  if (!input.outerwear && input.outerwear_type !== "none") errors.push("outerwear_type must be none when outerwear=false");
  if (input.suit_or_blazer && input.outerwear) errors.push("a blazer must not also be classified as outerwear");
  if (!input.branded_apparel && input.visible_brand !== null) errors.push("visible_brand must be null when branded_apparel=false");
  return errors;
}
