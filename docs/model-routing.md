# Model routing and quality control

## Primary model

The final field was classified with `qwen/qwen3-vl-30b-a3b-instruct` through OpenRouter.

Qwen was used outside Clay because:

- it supported multimodal image input
- the output could be constrained to JSON
- open-weight inference was inexpensive
- external calls avoided paid-only Clay HTTP or custom-function dependencies

## Benchmark before batch

The classifier was tested on a known profile before running the complete field. Prompt revisions clarified distinctions that materially affected scoring, including:

- blazer versus generic outerwear
- button-down shirt versus overshirt or jacket
- puffer/down outerwear versus formal coat
- literal brand detection versus style-based guessing
- business-casual professional tops beyond a menswear-only schema

The benchmark was used to improve the contract, not to tune the prompt toward a desired company result.

## Inclusive schema revision

The original garment list overrepresented conventional menswear. Three fields were added:

- `blouse_or_professional_top`
- `dress_or_jumpsuit`
- `traditional_formalwear`

The model was instructed to describe garments only and never infer identity or background from traditional clothing.

## Validation

Every response is normalized and validated before scoring. Examples:

- `vest_type` becomes `none` when `vest=false`
- `outerwear_type` becomes `none` when `outerwear=false`
- a blazer cannot also count as generic outerwear
- `visible_brand` is removed unless branded apparel is true
- enum values outside the allowed set are rejected or normalized
- confidence is clamped to 0–100

## Fallback policy

The public code exposes a routing pattern rather than claiming that more models automatically improve accuracy:

1. accept a valid, usable high-confidence Qwen result
2. route low-confidence or unusable outputs for review
3. use a stronger vision model only when the first result is genuinely uncertain
4. use human judgment for unresolved garment ambiguity

The production pilot did not need DeepSeek Vision as a default layer. A dependable, verified vision endpoint was not required once the Qwen prompt and schema were stable.

## Corrections

A recount edits the structured clothing record first. Company scores and prose are then regenerated downstream. Editorial text is never used as the source of truth.

