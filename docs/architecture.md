# Architecture

## Design objective

Build a playful visual benchmark without turning the entire pipeline into one untestable AI prompt.

The system separates five concerns:

1. candidate discovery
2. roster qualification
3. visual classification
4. deterministic scoring
5. editorial presentation

Each stage emits structured data that can be inspected before the next stage runs.

## Stage 1: bounded discovery

The seven pilot companies were selected before candidate search. Clay CLI queried current employees at those companies using a broad title family. The broad search was intentional: discovery should favor recall before the selection layer favors precision.

The two requests returned 84 people, leaving 16 of the period's 100-result allowance unused for exceptions. Search outputs retained Clay profile IDs and matched current experiences.

## Stage 2: roster policy

Candidate selection was not delegated to an LLM. Titles were normalized, mapped to seniority tiers and functions, and scored using a transparent policy. The algorithm attempted broad functional coverage before filling open seats with the highest-ranked eligible candidates.

The initial broad result included account executives and account managers. Those titles were valid for a general GTM employee analysis, but they did not fit the revised unit of analysis: people who act as visible representatives of leadership. The final policy excluded individual contributors and preferred C-suite, president, EVP/SVP, VP, and Head-level leaders.

Seniority alone was not enough. GTM proximity acted as a second ranking dimension. For example, a CMO was more relevant than a VP of Legal because the project examines public-facing GTM leadership presentation, not an organizational chart in the abstract.

## Stage 3: qualification gates

Every selected record required:

- evidence of current employment
- a meaningful leadership seat
- a LinkedIn profile URL
- a LinkedIn profile photo as the controlled source type
- enough visible clothing for classification
- no duplicate person or profile

Failures were routed to replacement rather than counted as missing data. A company was publishable only after eight records passed.

## Stage 4: multimodal classification

Images were sent to `qwen/qwen3-vl-30b-a3b-instruct` through OpenRouter. The model returned one constrained JSON object. Normalization then:

- coerced boolean-like values
- constrained enums
- removed impossible vest and outerwear combinations
- prevented a blazer from also being counted as generic outerwear
- removed a visible brand when branded apparel was false

Confidence and schema validity were routing signals, not proof of correctness.

## Stage 5: deterministic scoring

The accepted clothing fields were imported into Clay. Cohorts and numeric scores were formulas, so identical inputs always generated identical outputs. Formula order mattered because a photo could contain more than one visible garment.

For example, vest plus button-down takes precedence over a generic business-casual rule, while a quarter-zip takes precedence over blazer detection in the project taxonomy.

## Stage 6: company aggregation

A second Clay table contained one row per company. `Lookup Multiple Rows in Other Table` retrieved exactly eight person records by company. Formula columns then calculated:

- average formality
- average founder casual
- average deal-room energy
- dominant cohort
- uniform strength
- dominant color
- a readable style signal

Uniform strength is the share of the eight leaders in the single most frequent cohort. Ties are resolved alphabetically to keep results deterministic.

## Stage 7: narrative generation

Clay's AI layer received the company-level fields and wrote a short synopsis. The prompt prohibited numeric scores and internal category labels in the synopsis, allowing the table to carry analytical detail while the prose remained readable without a legend.

Narrative generation occurs last. It cannot alter clothing observations, cohort assignment, scores, or company rankings.

## Why this architecture matters

A single multimodal prompt could have looked at eight photos and written a funny paragraph. It would also have been difficult to audit, reproduce, compare, or correct.

This design assigns:

- search to Clay's data layer
- selection to explicit policy
- visual ambiguity to a vision model
- calculation to deterministic code and formulas
- aggregation to relational lookup
- prose to a language model

That makes a joke project behave like a real data product.

