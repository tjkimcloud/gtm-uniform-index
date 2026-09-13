# Clay formula reference

These expressions mirror the final logic. In Clay, insert column tokens with `/` so the references bind to the actual columns rather than remaining plain text.

## Clothing Cohort

```javascript
{{vest}}=="true"&&{{button_down}}=="true"?"Deal Room Uniform":{{quarter_zip}}=="true"?"Quarter-Zip Operator":{{suit_or_blazer}}=="true"||{{tie}}=="true"||{{traditional_formalwear}}=="true"||{{primary_formality}}?.toLowerCase()=="formal"?"Boardroom Classic":{{hoodie}}=="true"?"Startup Uniform":{{outerwear}}=="true"?"Outerwear Operator":{{button_down}}=="true"||{{polo}}=="true"||{{blouse_or_professional_top}}=="true"||{{dress_or_jumpsuit}}=="true"||{{primary_formality}}?.toLowerCase()=="business_casual"?"Corporate Casual":{{tshirt}}=="true"||{{sweater}}=="true"?"Founder Casual":"Relaxed Professional"
```

If the source columns are native checkboxes instead of imported text, use a helper that treats both boolean `true` and text `"true"` as true.

## Wardrobe Vibe

```javascript
{{Clothing Cohort}}=="Deal Room Uniform"?"Deal Room Energy":{{Clothing Cohort}}=="Quarter-Zip Operator"?"Operator Energy":{{Clothing Cohort}}=="Boardroom Classic"?"Boardroom Energy":{{Clothing Cohort}}=="Startup Uniform"?"Startup Energy":{{Clothing Cohort}}=="Outerwear Operator"?"All-Weather Energy":{{Clothing Cohort}}=="Corporate Casual"?"Client-Ready Energy":{{Clothing Cohort}}=="Founder Casual"?"Builder Energy":{{Clothing Cohort}}=="Relaxed Professional"?"Come-As-You-Are":"Needs Review"
```

## Formality Score

```javascript
Math.max(0,Math.min(100,Math.round(40+(["true",true]?.includes({{tie}})?25:0)+(["true",true]?.includes({{suit_or_blazer}})?30:0)+(["true",true]?.includes({{button_down}})?15:0)+(["true",true]?.includes({{polo}})?10:0)+(["true",true]?.includes({{vest}})?10:0)+(["true",true]?.includes({{quarter_zip}})?5:0)+(["true",true]?.includes({{blouse_or_professional_top}})?15:0)+(["true",true]?.includes({{dress_or_jumpsuit}})?30:0)+(["true",true]?.includes({{traditional_formalwear}})?45:0)-(["true",true]?.includes({{tshirt}})?15:0)-(["true",true]?.includes({{hoodie}})?20:0)-({{outerwear_type}}?.toLowerCase()=="puffer"?15:{{outerwear_type}}?.toLowerCase()=="shell"?15:{{outerwear_type}}?.toLowerCase()=="jacket"?10:{{outerwear_type}}?.toLowerCase()=="overshirt"?10:{{outerwear_type}}?.toLowerCase()=="other"?5:0))))
```

## Founder Casual Score

```javascript
((t)=>Math.max(0,Math.min(100,Math.round(35+(t({{tshirt}})?25:0)+(t({{hoodie}})?25:0)+(t({{sweater}})?10:0)+(0.35*(100-Number({{Formality Score}}||0)))-(t({{suit_or_blazer}})?15:0)-(t({{tie}})?15:0)))))(v=>v===true||String(v).toLowerCase()==="true")
```

## Deal Room Energy

```javascript
Math.min(100,Math.max(0,Math.round(10+(({{vest}}=="true"||{{vest}}===true)?30:0)+(({{button_down}}=="true"||{{button_down}}===true)?20:0)+(({{quarter_zip}}=="true"||{{quarter_zip}}===true)?20:0)+(({{blouse_or_professional_top}}=="true"||{{blouse_or_professional_top}}===true)?20:0)+(({{dress_or_jumpsuit}}=="true"||{{dress_or_jumpsuit}}===true)?20:0)+(({{traditional_formalwear}}=="true"||{{traditional_formalwear}}===true)?25:0)+(["navy","gray","black"]?.includes({{dominant_color}}?.toLowerCase())?10:0)+({{primary_formality}}?.toLowerCase()=="business_casual"?10:0)+({{primary_formality}}?.toLowerCase()=="formal"?15:0)+(({{tie}}=="true"||{{tie}}===true)?5:0))))
```

## Badges

```javascript
[{{visible_brand}}?.toLowerCase()?.includes("patagonia")&&"Patagonia Confirmed",["true",true]?.includes({{branded_apparel}})&&"Company Swag",{{dominant_color}}?.toLowerCase()==="navy"&&"Navy Nation",["true",true]?.includes({{outerwear}})&&"Layer Player"]?.filter(Boolean)?.join(" | ")
```

## Average company score

Replace the child-column name for each metric.

```javascript
((values)=>values?.length?Math.round(values.reduce((sum,value)=>sum+value,0)/values.length):"")({{Leadership Records}}?.records?.map(record=>Number(record?.["Formality Score"]))?.filter(Number.isFinite))
```

## Dominant Cohort

```javascript
Object.entries(({{Leadership Records}}?.records||[])?.reduce((counts,record)=>record?.["Clothing Cohort"]?.trim()?Object.assign(counts,Object.fromEntries([[record["Clothing Cohort"],(counts?.[record["Clothing Cohort"]]||0)+1]])):counts,Object.create(null)))?.sort((a,b)=>b?.[1]-a?.[1]||a?.[0]?.localeCompare(b?.[0]))?.[0]?.[0]||""
```

## Uniform Strength

```javascript
((records)=>records.length?Math.round((records.filter(record=>record?.["Clothing Cohort"]==={{Dominant Cohort}}).length/records.length)*100):"")(({{Leadership Records}}?.records||[]).filter(record=>record?.["Clothing Cohort"]))
```

## Leadership Style Signal

```javascript
Number({{Uniform Strength}})<40?"High Style Variety":{{Dominant Cohort}}?.toLowerCase()==="boardroom classic"?"Formal & Executive":(["deal room uniform","quarter-zip operator"]?.includes({{Dominant Cohort}}?.toLowerCase()))?"Operator-Led":{{Dominant Cohort}}?.toLowerCase()==="corporate casual"?"Polished & Flexible":{{Dominant Cohort}}?.toLowerCase()==="outerwear operator"?"Relaxed & Practical":(["startup uniform","founder casual","relaxed professional"]?.includes({{Dominant Cohort}}?.toLowerCase()))?"Come-As-You-Are":"Mixed Leadership Style"
```

