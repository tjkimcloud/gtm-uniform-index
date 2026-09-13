# Roster methodology

## The unit of analysis

The project began with eight standardized GTM role buckets per company. That approach worked for employee-level representation, but the first candidate pool revealed that it could select account executives and account managers alongside founders and executives.

That mixture answered the wrong question. The revised project compares the visible, public-facing leadership layer of each company.

## Two-dimensional ranking

Candidates were evaluated on two independent dimensions.

### 1. Leadership seniority

Default order:

1. founder and C-suite
2. president, EVP, and SVP
3. VP
4. Head of function
5. director, only as a conditional coverage fill
6. individual contributor, excluded from the final leadership roster

This was a hierarchy, not a rigid demand for eight C-suite executives. Smaller companies often express equivalent responsibility through Head or VP titles.

### 2. GTM proximity

Default functional priority:

1. founder or CEO
2. revenue and sales leadership
3. marketing leadership
4. GTM, revenue, and marketing operations
5. growth and partnerships
6. customer leadership
7. product and technology leadership
8. operations and strategy
9. people leadership
10. finance
11. legal

Functional priority does not claim one department is more important to the company. It measures relevance to this experiment.

A CMO generally outranks a VP of Legal for this roster because the CMO is closer to the company's public GTM motion. A Chief Customer Officer can outrank a more senior back-office title for the same reason. Founder and CEO roles remain high-priority because they are often the most visible company representatives.

## Coverage before duplication

The selector first attempts to fill distinct leadership seats. It does not select eight sales leaders simply because they have high titles.

Target coverage includes:

- founder or CEO
- revenue or sales
- marketing
- GTM operations
- growth or partnerships
- customer
- product or technology
- operations or strategy

People and other public-facing executive functions can fill a seat when a company lacks one of the preferred categories or when the role better represents the company's visible leadership structure.

## Candidate scoring

The reusable example policy stores explicit seniority and functional weights in [`config/leadership-policy.json`](../config/leadership-policy.json). The score is used to order candidates within a coverage decision. It is not a measure of leadership quality.

Selection pseudocode:

```text
normalize company and title
classify seniority tier
classify leadership function
reject individual contributors
calculate seniority weight + GTM proximity weight

for each preferred leadership function:
    select highest-scoring qualified candidate not already selected

while company has fewer than eight people:
    select highest-scoring remaining qualified candidate

route every selected person through evidence and photo gates
replace failures
publish only when company has exactly eight passes
```

## Source-backed qualification

The policy layer cannot prove that a title is current or that a photo is usable. Selected records therefore passed a second qualification stage.

### Employment and role evidence

Accepted evidence included:

- official company leadership pages
- company announcements
- current professional profiles
- credible event or press biographies when needed

The record retained a source URL and an as-of date.

### Photo control

All final images came from LinkedIn profile photos. Mixing company headshots, conference photos, and press images would introduce a source-style confound.

A photo passed only if:

- the target person was unambiguous
- the upper torso was sufficiently visible
- clothing was not materially obstructed
- resolution was sufficient for garment-level classification

No visible photo or an unusable crop triggered replacement. It did not become a blank observation.

## Equal sample rule

Every company contributed exactly eight usable people. This prevents a company with one or two available photos from appearing more consistent simply because its sample was smaller.

## Exception routing

Rules handle the common case. Exceptions receive targeted review:

| Exception | Route |
|---|---|
| Ambiguous title | Verify responsibilities from a primary source |
| Senior but weak GTM relevance | Compare with the next eligible GTM-facing leader |
| Current employment unclear | Require a dated source or replace |
| LinkedIn photo absent | Replace; do not substitute another source type |
| Clothing not judgeable | Replace |
| Duplicate functional seats | Keep only when all higher-priority coverage needs are met |
| Model confidence below threshold | Run fallback or review the structured fields |

This is a rule-based selection pass followed by source-backed exception review. It is neither a blind search export nor an opaque AI ranking.

