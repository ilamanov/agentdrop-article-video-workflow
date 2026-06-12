import { mkdir, readFile, writeFile } from "node:fs/promises";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("OPENAI_API_KEY is required for narration generation.");
}

const model = process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts";
const voice = process.env.OPENAI_TTS_VOICE ?? "alloy";
const narration = JSON.parse(await readFile("artifacts/narration.json", "utf8"));

await mkdir("artifacts/audio", { recursive: true });

for (const section of narration.sections) {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      voice,
      input: section.text,
      response_format: "mp3"
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI TTS failed for ${section.id}: ${response.status} ${await response.text()}`);
  }

  const outputPath = `artifacts/audio/${section.id}.mp3`;
  await writeFile(outputPath, Buffer.from(await response.arrayBuffer()));
  section.audioPath = outputPath;
  console.log(`Wrote ${outputPath}`);
}

await writeFile("artifacts/narration.json", `${JSON.stringify(narration, null, 2)}\n`);

