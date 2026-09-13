import { readFile } from "node:fs/promises";
import { normalizeClassification, validateClassification } from "./lib/classification.mjs";

const imageUrl = process.argv[2];
if (!imageUrl) throw new Error("Usage: npm run classify:one -- <authorized-image-url>");
if (!process.env.OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is required");

const markdown = await readFile(new URL("../prompts/clothing-classifier.md", import.meta.url), "utf8");
const prompt = markdown.match(/```text\n([\s\S]*?)```/)?.[1];
if (!prompt) throw new Error("Could not extract classifier prompt");

const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: process.env.OPENROUTER_MODEL || "qwen/qwen3-vl-30b-a3b-instruct",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [{
      role: "user",
      content: [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: imageUrl } }
      ]
    }]
  })
});

if (!response.ok) throw new Error(`OpenRouter request failed: ${response.status} ${await response.text()}`);
const payload = await response.json();
const raw = payload.choices?.[0]?.message?.content;
const parsed = JSON.parse(raw);
const normalized = normalizeClassification(parsed);
const errors = validateClassification(normalized);
if (errors.length) throw new Error(`Invalid model output: ${errors.join("; ")}`);
console.log(JSON.stringify(normalized, null, 2));

