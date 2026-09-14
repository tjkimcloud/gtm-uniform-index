# Publishing and article notes

This file preserves the project story for a LinkedIn carousel, long-form article, or interview discussion.

## Locked opening

> I used Clay and an open-weight vision model to build the critical piece of GTM infrastructure absolutely nobody was waiting for:
>
> The GTM Uniform Index.
>
> It covers seven companies, eight senior leaders each, and one unnecessarily rigorous analysis of the clothing visible in their LinkedIn profile photos.
>
> The idea came to me at a birthday party my son attended as I watched him and the other kids play Mario Kart. I had some extra Clay credits and apparently no ability to leave a ridiculous question alone.

## The candidate-selection story

The first search produced the kind of roster the query requested: a broad mix of GTM roles. It included account executives and account managers. That was a useful failure because it forced a sharper definition of the unit of analysis.

The project was not trying to describe every employee. It was trying to compare the people most likely to serve as the visible face of the company.

The revised selection system introduced:

- a leadership ladder from founder/C-suite through president, EVP/SVP, VP, and Head of function
- a GTM-proximity score that preferred marketing, revenue, growth, customer, product, and operations leadership over functions less connected to the GTM motion
- functional coverage rules so one department could not dominate the roster
- a hard eight-person qualification gate for every company
- current-employment, source, LinkedIn-photo, and clothing-visibility checks

The memorable example is CMO versus VP of Legal. Both may be senior. The CMO is closer to the public GTM motion being studied, so the CMO receives the higher functional priority for this specific roster.

## The architecture story

The project intentionally did not ask one model to do everything.

- Clay CLI found the initial candidate pool.
- Rules normalized and ranked candidates.
- Source-backed review resolved exceptions.
- Qwen interpreted visible clothing.
- Validation code enforced the model contract.
- Clay formulas calculated deterministic outputs.
- Clay lookups aggregated eight people into company results.
- Clay AI translated the results into readable prose.

The concise design lesson:

> AI handled ambiguity and prose. Rules handled repeatability.

## Interview discussion prompts

- Why use a broad search and a narrow qualification layer?
- Why preserve 16 search results instead of spending the entire quota?
- Why keep image classification outside Clay?
- Why import structured results back into Clay?
- Why make cohort precedence deterministic?
- How did the schema change after testing professional clothing across different presentations?
- What causes a candidate or image to be replaced?
- How does Demand a Recount propagate a correction through the system?
- What would change at 20 companies or 160 people?

## Carousel story

1. The critical GTM infrastructure nobody requested
2. The birthday-party question
3. Seven companies and 56 leaders
4. The candidate search that selected the wrong level of employee
5. The leadership and GTM-proximity depth chart
6. Qwen plus Clay architecture
7. Score definitions
8. Company leaderboard
9. The box score got weird
10. Demand a Recount
