import { execFile as execFileCallback } from "node:child_process";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import ffmpegPath from "ffmpeg-static";

const execFile = promisify(execFileCallback);

if (!ffmpegPath) {
  throw new Error("ffmpeg-static did not provide an ffmpeg binary.");
}

const sectionsDocument = JSON.parse(await readFile("artifacts/sections.json", "utf8"));
const narrationDocument = JSON.parse(await readFile("artifacts/narration.json", "utf8"));
const manifest = JSON.parse(await readFile("artifacts/production-manifest.json", "utf8"));
const sections = sectionsDocument.sections;
const narrationById = new Map(
  narrationDocument.sections.map((section) => [section.id, section]),
);

await mkdir("artifacts/video-tmp", { recursive: true });

const segmentPaths = [];

for (const [index, section] of sections.entries()) {
  const imagePath = section.imagePath || `artifacts/images/${section.id}.png`;
  const audioPath =
    narrationById.get(section.id)?.audioPath ||
    section.audioPath ||
    `artifacts/audio/${section.id}.mp3`;
  await assertFile(imagePath, `Missing generated image for ${section.id}`);
  await assertFile(audioPath, `Missing narration audio for ${section.id}`);

  const segmentPath = `artifacts/video-tmp/${String(index + 1).padStart(2, "0")}-${section.id}.mp4`;
  await execFile(ffmpegPath, [
    "-y",
    "-loop",
    "1",
    "-i",
    imagePath,
    "-i",
    audioPath,
    "-c:v",
    "libx264",
    "-tune",
    "stillimage",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-pix_fmt",
    "yuv420p",
    "-vf",
    "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1",
    "-shortest",
    segmentPath,
  ]);

  section.imagePath = imagePath;
  section.audioPath = audioPath;
  segmentPaths.push(segmentPath);
}

const concatList = segmentPaths
  .map((segmentPath) => `file '${path.resolve(segmentPath).replaceAll("'", "'\\''")}'`)
  .join("\n");
await writeFile("artifacts/video-tmp/concat.txt", `${concatList}\n`);

await execFile(ffmpegPath, [
  "-y",
  "-f",
  "concat",
  "-safe",
  "0",
  "-i",
  "artifacts/video-tmp/concat.txt",
  "-c",
  "copy",
  "artifacts/final-video.mp4",
]);

manifest.status = "video_generated";
manifest.notes = [
  ...(manifest.notes ?? []).filter((note) => !note.includes("Placeholder")),
  "Generated section images, narration audio, and final MP4 video.",
];
manifest.sections = sections.map((section) => ({
  id: section.id,
  imagePath: section.imagePath,
  audioPath: section.audioPath,
}));
manifest.outputs = upsertOutputs(manifest.outputs ?? [], [
  { path: "artifacts/video-plan.md", type: "markdown" },
  { path: "artifacts/sections.json", type: "json" },
  { path: "artifacts/narration.json", type: "json" },
  { path: "artifacts/image-prompts.md", type: "markdown" },
  { path: "artifacts/production-manifest.json", type: "json" },
  { path: "artifacts/preview.html", type: "html" },
  { path: "artifacts/final-video.mp4", type: "video/mp4" },
]);

await writeFile("artifacts/sections.json", `${JSON.stringify(sectionsDocument, null, 2)}\n`);
await writeFile("artifacts/production-manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);

console.log("Wrote artifacts/final-video.mp4.");

async function assertFile(filePath, message) {
  try {
    await access(filePath);
  } catch {
    throw new Error(`${message}: ${filePath}`);
  }
}

function upsertOutputs(existing, additions) {
  const byPath = new Map(existing.map((item) => [item.path, item]));
  for (const item of additions) {
    byPath.set(item.path, item);
  }
  return [...byPath.values()];
}
