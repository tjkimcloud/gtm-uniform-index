# Quality control and audit

## Why the review layer exists

The vision model's job was to convert an ambiguous image into structured clothing fields. A successful API call or valid JSON object did not prove that every field was correct.

Every classification therefore passed through three distinct checks:

1. **Schema validation:** confirm required fields, booleans, enums, and numeric bounds.
2. **Consistency normalization:** remove impossible combinations and apply the same garment definitions to every record.
3. **Visual exception review:** inspect ambiguous or consequential fields before accepting the row for scoring.

Only reviewed structured fields could feed the deterministic scoring layer.

## Final audit results

| Check | Result |
|---|---:|
| Qualified leadership photos | 56 |
| Structurally valid first-attempt model responses | 56 |
| Accepted without field changes | 31 |
| Corrected or normalized during review | 25 |
| Companies with exactly eight accepted records | 7 of 7 |

The 25 reviewed corrections should not be interpreted as 25 completely failed classifications. Many were narrow normalizations that preserved most of the original object while making one field consistent with the locked taxonomy.

## What the review caught

Examples included:

- a plain crew-neck T-shirt incorrectly tagged as a hoodie
- a blazer or structured jacket confused with generic outerwear
- an outer layer mistaken for a button-down shirt
- a visible professional top forced into a menswear-centered category
- a formality label that conflicted with clearly detected garments
- a brand field populated without a readable mark

These corrections mattered because one changed boolean could alter cohort precedence and every downstream score.

## Correction flow

```text
model response
→ schema validation
→ consistency normalization
→ targeted visual review
→ accepted clothing record
→ deterministic scores
→ company aggregation
→ synopsis
```

The editorial synopsis is never corrected directly. A recount changes the structured observation first, then regenerates every downstream result.

## Reproducible checks

The public test suite covers:

- leadership seniority and functional classification
- GTM-proximity ranking
- functional roster coverage
- rejection of individual contributors and unusable photos
- schema normalization and impossible garment combinations
- deterministic cohort precedence
- company uniform-strength calculation
- score boundaries
- loading the runtime roster policy from the public configuration

Run the checks with:

```bash
npm test
```

The repository publishes only aggregate audit counts and synthetic person-level examples. It does not redistribute source photos or private person-level results.
