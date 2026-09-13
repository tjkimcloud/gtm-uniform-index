# Clay implementation

## Tables

### 1. Leadership records

One row per qualified person. The reviewed classification CSV was imported into Clay with the structured clothing fields already populated.

Derived formula columns:

- Clothing Cohort
- Wardrobe Vibe
- Formality Score
- Founder Casual Score
- Deal Room Energy
- Badges

### 2. Company leaderboard

One row per company. `Lookup Multiple Rows in Other Table` searched the leadership table where `company` equaled the current company row, with a limit of eight.

The lookup was treated as a validation checkpoint: every company had to return exactly eight records.

Derived company columns:

- Average Formality Score
- Avg Founder Casual Score
- Avg Deal Room Energy
- Dominant Cohort
- Uniform Strength
- Dominant Color
- Leadership Style Signal
- Company Synopsis

## Cohort precedence

The formula applies rules in this order:

1. vest plus button-down → Deal Room Uniform
2. quarter-zip → Quarter-Zip Operator
3. blazer, tie, traditional formalwear, or formal primary classification → Boardroom Classic
4. hoodie → Startup Uniform
5. outerwear → Outerwear Operator
6. button-down, polo, professional top, dress/jumpsuit, or business-casual classification → Corporate Casual
7. T-shirt or sweater → Founder Casual
8. otherwise → Relaxed Professional

Precedence prevents one record from landing in multiple cohorts.

## Score definitions

### Formality Score

Starts at 40. Visible formal garments add points; casual garments and casual outerwear subtract points. The result is rounded and clamped to 0–100.

```text
40
+ 25 tie
+ 30 suit or blazer
+ 15 button-down
+ 10 polo
+ 10 vest
+ 5 quarter-zip
+ 15 blouse or professional top
+ 30 dress or jumpsuit
+ 45 traditional formalwear
- 15 T-shirt
- 20 hoodie
- 15 puffer or shell
- 10 jacket or overshirt
- 5 other outerwear
```

This is visible clothing formality, not professionalism.

### Founder Casual Score

Starts at 35, rewards visible startup-casual garments, incorporates the inverse of the formality score, and penalizes a suit/blazer or tie.

```text
35
+ 25 T-shirt
+ 25 hoodie
+ 10 sweater
+ 0.35 × (100 - Formality Score)
- 15 suit or blazer
- 15 tie
```

### Deal Room Energy

Starts at 10 and rewards garments associated with client-facing GTM presentation in this project taxonomy.

```text
10
+ 30 vest
+ 20 button-down
+ 20 quarter-zip
+ 20 blouse or professional top
+ 20 dress or jumpsuit
+ 25 traditional formalwear
+ 10 navy, gray, or black
+ 10 business casual
+ 15 formal
+ 5 tie
```

## Company aggregation formulas

Average columns map the eight lookup records to their numeric child-column values, filter invalid numbers, and round the mean.

Conceptually:

```javascript
const values = records
  .map(record => Number(record["Formality Score"]))
  .filter(Number.isFinite);

const average = values.length
  ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
  : "";
```

Dominant Cohort counts nonblank cohort labels and selects the highest frequency. Alphabetical order breaks a tie.

Uniform Strength is:

```text
leaders in Dominant Cohort ÷ leaders with a cohort × 100
```

Dominant Color counts the allowed color values and selects the most frequent.

## Leadership Style Signal

This is deterministic editorial packaging:

- uniform strength below 40 → High Style Variety
- Boardroom Classic → Formal & Executive
- Deal Room Uniform or Quarter-Zip Operator → Operator-Led
- Corporate Casual → Polished & Flexible
- Outerwear Operator → Relaxed & Practical
- Startup Uniform, Founder Casual, or Relaxed Professional → Come-As-You-Are
- otherwise → Mixed Leadership Style

It describes the visible photo set only.

## Company synopsis prompt

The final Clay AI prompt uses the numeric and categorical columns as private inputs but forbids repeating them in the prose. This creates a synopsis that can be read without understanding the scoring system.

The model is instructed to describe:

- whether the set leans formal, casual, or between the two
- whether clothing is consistent or varied
- the dominant color only when useful
- one light observation grounded in supplied fields

It must not infer personality, gender, company culture, performance, or leadership ability.

See [`prompts/company-synopsis.md`](../prompts/company-synopsis.md).

## Cost boundary

- Clay CLI search consumed search-result quota.
- Qwen image calls consumed OpenRouter balance, not Clay actions.
- Deterministic formulas did not need model calls.
- Only seven company rows required narrative generation in Clay.

The workflow spends AI budget at the two points where AI adds value: image interpretation and prose.

