# The GTM Uniform Index

I used Clay and an open-weight vision model to build the critical piece of GTM infrastructure absolutely nobody was waiting for.

The GTM Uniform Index is an unnecessarily rigorous analysis of the clothing visible in senior leaders' LinkedIn profile photos. The pilot covers seven companies, eight leaders per company, one controlled photo source, and a workflow designed to be reproducible on Clay's Free plan.

The premise is playful. The architecture is real.

## What the project tests

Had GTM leadership finally achieved perfect alignment? Or was it only from the shoulders down?

More precisely: do the public-facing leaders at a company accidentally develop a recognizable wardrobe pattern in their profile photos?

This project does **not** infer personality, professionalism, leadership ability, business performance, protected traits, or actual company culture. It records visible garments and presentation signals in a point-in-time set of profile photos.

## Pilot field

The launch analysis used 56 qualified leaders across:

- Apollo
- Clay
- Gong
- HubSpot
- Profound
- Salesforce
- Vercel

Each company had to supply exactly eight qualified photos. A company could not enter the comparison with a smaller or less complete roster.

## Why the candidate roster changed

The first Clay CLI search intentionally cast a wide GTM net. It included founders, executives, marketing, revenue, sales, RevOps, growth, customer success, account executives, and account managers. That was useful for recall, but it exposed a design problem: a roster full of individual contributors would measure the broader employee population, not the public-facing leadership group the experiment intended to compare.

The selection policy therefore evolved in two steps:

1. **Seniority gate:** prioritize founder and C-suite roles, followed by presidents, EVPs/SVPs, VPs, and Heads of function. Directors were conditional coverage fills. Individual contributors were excluded from the final leadership field.
2. **GTM proximity:** among similarly senior people, prefer roles closest to how the company goes to market. A CMO, CRO, Head of Growth, VP of GTM Operations, or Chief Customer Officer was more relevant to this experiment than a similarly senior legal or administrative leader.

The final roster was not simply “the eight most senior titles.” It was a balanced set of people who combined leadership seniority, GTM relevance, public-facing responsibility, current employment evidence, and a usable LinkedIn photo.

See [Roster methodology](docs/roster-methodology.md) for the complete rules and exception routing.

## System architecture

```mermaid
flowchart LR
    A[7 target companies] --> B[Clay CLI people search]
    B --> C[84-person candidate pool]
    C --> D[Title normalization]
    D --> E[Seniority and GTM relevance scoring]
    E --> F[Source-backed qualification]
    F --> G[56 leaders: 8 per company]
    G --> H[LinkedIn photo visibility gate]
    H --> I[Qwen vision via OpenRouter]
    I --> J[Structured clothing fields]
    J --> K[Validation and exception review]
    K --> L[Clay deterministic formulas]
    L --> M[Clay multi-row company lookup]
    M --> N[Company leaderboard]
    N --> O[Clay AI synopsis]
```

## Division of responsibility

| Component | Responsibility | Why |
|---|---|---|
| Clay CLI | Bounded candidate sourcing | Search programmatically while preserving the Free-plan quota |
| Local rules | Normalize titles and rank candidates | Repeatable selection logic is cheaper and more auditable than an LLM |
| Source-backed review | Resolve employment, relevance, and photo exceptions | Public web evidence is better than guessing from a title |
| Qwen via OpenRouter | Interpret visible clothing | Vision is ambiguous and benefits from a multimodal model |
| Validation code | Enforce schema and route uncertainty | A model response is not automatically a valid record |
| Clay formulas | Assign cohorts and calculate scores | The same inputs should always produce the same outputs |
| Clay table lookup | Aggregate eight people into one company row | Keeps the person-level and company-level workflows separate |
| Clay AI | Translate structured results into readable synopses | Narrative generation is useful after the underlying facts are fixed |

The governing design principle was simple: **use AI for ambiguity and prose; use rules for repeatability.**

## Quality-control results

The first model response was never treated as ground truth. Every record passed through schema validation and a rules-based review before it could affect a score.

The final audit produced:

- 84 broadly retrieved candidates narrowed to 56 qualified leaders
- 56 of 56 photos returned a structurally valid classification on the first model attempt
- 31 classifications accepted without changes
- 25 classifications corrected or normalized during review
- 10 automated tests covering policy loading, roster selection, schema normalization, cohort precedence, aggregation, and score boundaries

A valid JSON response is not the same as a correct observation. The review step caught issues such as a T-shirt tagged as a hoodie, a blazer treated as generic outerwear, and formality labels that conflicted with the locked garment rules.

See [Quality control and audit](docs/quality-control.md) for the review contract and aggregate results.

## Free-plan constraint

The Clay CLI Free-plan search allowance was 100 results for the period. The search was split into two bounded requests:

- 48 candidates across Apollo, Clay, Profound, and Vercel
- 36 candidates across Gong, HubSpot, and Salesforce
- 84 total results used
- 16 results held back for coverage gaps

The expensive vision work ran outside Clay through OpenRouter. Reviewed results were imported into Clay, where formulas and lookups handled the deterministic analysis. This avoided paid-only HTTP and custom-function dependencies.

## Classification schema

Qwen returned a constrained JSON object describing only visible properties, including:

- garment flags such as blazer, button-down, vest, quarter-zip, sweater, polo, hoodie, T-shirt, blouse or professional top, dress or jumpsuit, and traditional formalwear
- outerwear and vest subtypes
- dominant clothing color
- primary formality
- literal branded apparel, only when a mark was readable
- whether enough clothing was visible to classify
- model confidence

The inclusive garment fields were added after reviewing where a menswear-centered schema failed to describe professional clothing consistently.

## Deterministic outputs

The structured observations produce:

- Clothing Cohort
- Wardrobe Vibe
- Formality Score
- Founder Casual Score
- Deal Room Energy
- Literal garment badges
- Dominant company cohort
- Uniform Strength
- Dominant color
- Leadership Style Signal

`Uniform Strength` is the percentage of a company's eight leaders assigned to its single most common clothing cohort. It is not an AI opinion.

## Aggregated pilot results

| Company | Dominant cohort | Uniform strength | Avg formality | Avg founder casual | Avg deal room | Dominant color |
|---|---|---:|---:|---:|---:|---|
| Apollo | Boardroom Classic | 88 | 91 | 16 | 53 | blue |
| HubSpot | Corporate Casual | 63 | 53 | 50 | 34 | blue |
| Salesforce | Boardroom Classic | 50 | 66 | 42 | 39 | black |
| Vercel | Corporate Casual | 50 | 39 | 72 | 33 | black |
| Profound | Boardroom Classic | 38 | 54 | 49 | 31 | blue |
| Gong | Corporate Casual | 38 | 45 | 63 | 30 | black |
| Clay | Founder Casual | 38 | 34 | 71 | 21 | other |

These are descriptive outputs from the selected photos, not estimates of the companies or their cultures.

## The box score got weird

- Black led the color field in 23 of 56 photos. The turtleneck may be gone, but the Steve Jobs palette survived.
- Apollo supplied five of the six visible ties in the entire study. Salesforce supplied the sixth.
- The hoodie category had one entrant across all 56 photos. It won by default.
- Clay's dominant clothing cohort matched only three of eight leaders. Somebody run another waterfall.

## Run the sanitized demo

Requirements: Node.js 20 or newer. There are no runtime dependencies.

```bash
npm test
npm run demo
```

Run the candidate policy against synthetic records:

```bash
npm run audit -- examples/synthetic-candidates.csv
```

Score already-classified synthetic records:

```bash
npm run score -- examples/synthetic-classifications.csv outputs/scored.csv outputs/company-summary.json
```

The repository intentionally contains synthetic person-level inputs and real company-level aggregates. It does not redistribute profile photos, raw person-level search exports, or credentials.

## Documentation

- [Architecture](docs/architecture.md)
- [Roster methodology](docs/roster-methodology.md)
- [Model routing and QA](docs/model-routing.md)
- [Quality control and audit](docs/quality-control.md)
- [Clay implementation](docs/clay-implementation.md)
- [Responsible-use boundary](docs/responsible-use.md)
- [Publishing and article notes](docs/publishing-notes.md)

## Demand a Recount

The public project includes a correction mechanic. If a profile has changed or a visible garment was classified incorrectly, the record can be rerun using the same photo-source policy, schema, and deterministic scoring rules. Corrections change the underlying fields first, then flow through the scores and company aggregates.

Same source. Same model contract. Same rules.
