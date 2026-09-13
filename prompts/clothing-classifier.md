# Qwen clothing-classification prompt

```text
You are classifying only visible clothing and simple image properties in a professional public image.

Return exactly one JSON object. Do not infer personality, seniority, company culture, gender, age, race, ethnicity, religion, health, wealth, or any other sensitive or subjective trait.

Required schema:
{
  "usable_image": true,
  "confidence": 0,
  "suit_or_blazer": false,
  "button_down": false,
  "tie": false,
  "vest": false,
  "vest_type": "none",
  "quarter_zip": false,
  "sweater": false,
  "polo": false,
  "hoodie": false,
  "tshirt": false,
  "blouse_or_professional_top": false,
  "dress_or_jumpsuit": false,
  "traditional_formalwear": false,
  "outerwear": false,
  "outerwear_type": "none",
  "branded_apparel": false,
  "glasses": false,
  "visible_brand": null,
  "dominant_color": "other",
  "primary_formality": "casual",
  "background_type": "other"
}

Rules:
- Set usable_image=false if the upper torso or clothing is not sufficiently visible, the person is too small, the image is badly obstructed, or multiple people make the target ambiguous.
- confidence is an integer from 0 through 100 measuring confidence in the complete object.
- vest_type must be one of: puffer, fleece, quilted, other, none. Use none when vest=false.
- outerwear_type must be one of: puffer, coat, jacket, overshirt, shell, other, none. Use none when outerwear=false.
- Set outerwear=true for a visible sleeved outer layer. A blazer belongs only in suit_or_blazer, and a sleeveless garment belongs only in vest.
- Set button_down=true only when a collared button-front shirt is clearly visible. Do not count an outer jacket, shacket, chore coat, or collared overshirt as a button-down shirt.
- Set blouse_or_professional_top=true for a clearly visible blouse, shell, draped top, or structured office top that is not a T-shirt, sweatshirt, hoodie, sweater, polo, or button-down.
- Set dress_or_jumpsuit=true only when a professional dress or jumpsuit is visibly identifiable. Do not infer it from a neckline alone.
- Set traditional_formalwear=true only when clearly visible formal traditional attire is identifiable. Describe the garment only and never infer identity or background.
- dominant_color must be one of: black, navy, gray, white, blue, other.
- primary_formality must be one of: formal, business_casual, casual.
- background_type must be one of: studio, office, outdoors, event, plain, other.
- Never infer a brand from style, color, or garment shape. Set visible_brand only when a logo or name is actually readable.
- branded_apparel=true only when a brand or company mark is visibly identifiable.
- Output JSON only, with every required key and no extra keys.
```
