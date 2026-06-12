import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "artifacts/video-plan.md",
  "artifacts/sections.json",
  "artifacts/narration.json",
  "artifacts/image-prompts.md",
  "artifacts/production-manifest.json",
  "artifacts/preview.html"
];

for (const file of requiredFiles) {
  await access(file);
}

const sections = JSON.parse(await readFile("artifacts/sections.json", "utf8"));
if (!Array.isArray(sections.sections) || sections.sections.length < 4 || sections.sections.length > 5) {
  throw new Error("sections.json must contain 4 or 5 sections.");
}

for (const section of sections.sections) {
  for (const key of ["id", "title", "durationSeconds", "narration", "onScreenText", "visualDescription", "imagePrompt"]) {
    if (!section[key]) {
      throw new Error(`Missing ${key} in ${section.id ?? "unknown section"}.`);
    }
  }
}

const narration = JSON.parse(await readFile("artifacts/narration.json", "utf8"));
if (!Array.isArray(narration.sections) || narration.sections.length !== sections.sections.length) {
  throw new Error("narration.json must include one entry per section.");
}

const manifest = JSON.parse(await readFile("artifacts/production-manifest.json", "utf8"));
if (!Array.isArray(manifest.outputs) || manifest.outputs.length === 0) {
  throw new Error("production-manifest.json must list outputs.");
}

console.log("Artifact validation passed.");

