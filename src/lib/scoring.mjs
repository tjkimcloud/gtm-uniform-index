const clamp = (value) => Math.max(0, Math.min(100, Math.round(value)));

export function clothingCohort(row) {
  if (row.vest && row.button_down) return "Deal Room Uniform";
  if (row.quarter_zip) return "Quarter-Zip Operator";
  if (row.suit_or_blazer || row.tie || row.traditional_formalwear || row.primary_formality === "formal") return "Boardroom Classic";
  if (row.hoodie) return "Startup Uniform";
  if (row.outerwear) return "Outerwear Operator";
  if (row.button_down || row.polo || row.blouse_or_professional_top || row.dress_or_jumpsuit || row.primary_formality === "business_casual") return "Corporate Casual";
  if (row.tshirt || row.sweater) return "Founder Casual";
  return "Relaxed Professional";
}

export const wardrobeVibes = {
  "Deal Room Uniform": "Deal Room Energy",
  "Quarter-Zip Operator": "Operator Energy",
  "Boardroom Classic": "Boardroom Energy",
  "Startup Uniform": "Startup Energy",
  "Outerwear Operator": "All-Weather Energy",
  "Corporate Casual": "Client-Ready Energy",
  "Founder Casual": "Builder Energy",
  "Relaxed Professional": "Come-As-You-Are"
};

export function formalityScore(row) {
  const outerwearAdjustment = {
    puffer: -15, shell: -15, jacket: -10, overshirt: -10, coat: 0, other: -5, none: 0
  }[row.outerwear_type || "none"] ?? 0;

  return clamp(
    40 + 25 * row.tie + 30 * row.suit_or_blazer + 15 * row.button_down +
    10 * row.polo + 10 * row.vest + 5 * row.quarter_zip +
    15 * row.blouse_or_professional_top + 30 * row.dress_or_jumpsuit +
    45 * row.traditional_formalwear - 15 * row.tshirt - 20 * row.hoodie +
    outerwearAdjustment
  );
}

export function founderCasualScore(row) {
  const formality = formalityScore(row);
  return clamp(
    35 + 25 * row.tshirt + 25 * row.hoodie + 10 * row.sweater +
    0.35 * (100 - formality) - 15 * row.suit_or_blazer - 15 * row.tie
  );
}

export function dealRoomEnergy(row) {
  const neutral = ["navy", "gray", "black"].includes(row.dominant_color);
  return clamp(
    10 + 30 * row.vest + 20 * row.button_down + 20 * row.quarter_zip +
    20 * row.blouse_or_professional_top + 20 * row.dress_or_jumpsuit +
    25 * row.traditional_formalwear + 10 * neutral +
    10 * (row.primary_formality === "business_casual") +
    15 * (row.primary_formality === "formal") + 5 * row.tie
  );
}

export function badges(row) {
  const values = [];
  const brand = (row.visible_brand || "").toLowerCase();
  if (brand.includes("patagonia")) values.push("Patagonia Confirmed");
  if (row.branded_apparel) values.push("Company Swag");
  if (row.dominant_color === "navy") values.push("Navy Nation");
  if (row.outerwear) values.push("Layer Player");
  return values.join(" | ");
}

export function derive(row) {
  const clothing_cohort = clothingCohort(row);
  return {
    ...row,
    clothing_cohort,
    wardrobe_vibe: wardrobeVibes[clothing_cohort],
    formality_score: formalityScore(row),
    founder_casual_score: founderCasualScore(row),
    deal_room_energy: dealRoomEnergy(row),
    badges: badges(row)
  };
}

function groupByCompany(rows) {
  const grouped = new Map();
  for (const row of rows.filter((item) => item.usable_image)) {
    if (!grouped.has(row.company)) grouped.set(row.company, []);
    grouped.get(row.company).push(row);
  }
  return grouped;
}

function dominantEntry(values) {
  const counts = new Map();
  for (const value of values.filter(Boolean)) counts.set(value, (counts.get(value) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0] || ["", 0];
}

export function leadershipStyleSignal(dominantCohort, uniformStrength) {
  if (uniformStrength < 40) return "High Style Variety";
  if (dominantCohort === "Boardroom Classic") return "Formal & Executive";
  if (["Deal Room Uniform", "Quarter-Zip Operator"].includes(dominantCohort)) return "Operator-Led";
  if (dominantCohort === "Corporate Casual") return "Polished & Flexible";
  if (dominantCohort === "Outerwear Operator") return "Relaxed & Practical";
  if (["Startup Uniform", "Founder Casual", "Relaxed Professional"].includes(dominantCohort)) return "Come-As-You-Are";
  return "Mixed Leadership Style";
}

export function summarizeCompanies(rows) {
  return [...groupByCompany(rows).entries()].map(([company, people]) => {
    const [dominant_cohort, dominantCount] = dominantEntry(people.map((person) => person.clothing_cohort));
    const [dominant_color] = dominantEntry(people.map((person) => person.dominant_color));
    const average = (field) => Math.round(people.reduce((sum, person) => sum + Number(person[field]), 0) / people.length);
    const uniform_strength = Math.round((dominantCount / people.length) * 100);
    return {
      company,
      usable_people: people.length,
      dominant_cohort,
      uniform_strength,
      average_formality: average("formality_score"),
      average_founder_casual: average("founder_casual_score"),
      average_deal_room: average("deal_room_energy"),
      dominant_color: dominant_color || "other",
      leadership_style_signal: leadershipStyleSignal(dominant_cohort, uniform_strength)
    };
  });
}

