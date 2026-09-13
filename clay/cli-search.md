# Clay CLI search

## Pilot query strategy

The companies were selected first. Clay CLI then searched for people currently employed by those companies.

The initial query included a deliberately broad set of GTM titles:

- founder and CEO
- CRO and revenue leadership
- CMO and marketing leadership
- sales leadership
- RevOps and marketing operations
- growth and demand generation
- account executives
- account managers and customer success

The broad search maximized recall. It was not the final roster definition.

## Bounded execution

The Free-plan period allowed 100 search results. The seven companies were split into two batches with a maximum of 12 results per company:

```text
Batch 1: four companies × 12 = 48 results
Batch 2: three companies × 12 = 36 results
Total: 84 results
Reserve: 16 results
```

The reserve protected the project from spending the full allowance before discovering missing leadership or photo coverage.

## Example query

See [`config/example-search.clayql`](../config/example-search.clayql). Use `clay --help` to confirm the current CLI command and flags because the CLI surface may change.

## Why search and selection are separate

Search answers “who might match?” Selection answers “who belongs in this experiment?”

When the first results included account executives and account managers, the search had not failed. It accurately followed the broad title request. The experiment definition had changed. Rather than repeatedly spending search quota on narrower prompts, the existing candidate pool was normalized and passed through a stricter leadership policy.

This is a common retrieval pattern:

1. retrieve broadly enough to avoid missing relevant people
2. normalize inconsistent source fields
3. apply explicit eligibility and ranking rules
4. investigate only exceptions
5. preserve unused quota for genuine gaps

