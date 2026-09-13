# Clay table setup

## Leadership table

Import one reviewed row per person. Keep source and classification columns separate from derived columns.

Suggested groups:

### Identity and evidence

- Company
- Person Name
- Title
- Leadership Tier
- Leadership Seat
- Employment Verified
- Role Source URL
- Profile URL
- Photo Source Type
- Photo Status
- Clothing Visibility
- As-of Date

### Model observations

- Usable Image
- Confidence
- garment flags
- vest and outerwear type
- dominant color
- primary formality
- branded apparel
- visible brand

### Deterministic outputs

- Clothing Cohort
- Wardrobe Vibe
- Formality Score
- Founder Casual Score
- Deal Room Energy
- Badges

## Company table

Create seven company rows. Add `Lookup Multiple Rows in Other Table`:

```text
Table to search: Leadership table
Target column: company
Operator: Equals
Row value: Company
Limit: 8
```

Run the lookup and confirm every company returns eight records before creating averages.

## Public view

Recommended visible columns:

- Company
- Dominant Cohort
- Uniform Strength
- Average Formality Score
- Avg Founder Casual Score
- Avg Deal Room Energy
- Dominant Color
- Leadership Style Signal
- Company Synopsis

Hide the raw multi-row lookup and the parent AI action column. Keep them in the table for traceability.

Sort by Uniform Strength descending, then Avg Deal Room Energy descending.

