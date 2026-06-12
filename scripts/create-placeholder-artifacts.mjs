import { mkdir, writeFile } from "node:fs/promises";

await mkdir("artifacts", { recursive: true });

const sections = {
  title: "Article-to-Video Explainer",
  sourceSummary:
    "Placeholder output. Replace this by running the agent with an uploaded article.",
  sections: [
    {
      id: "section-01",
      title: "The Hook",
      durationSeconds: 12,
      narration: "A dense article can hide one simple idea worth sharing.",
      onScreenText: "One article. One clear idea.",
      visualDescription: "A stack of papers becoming a simple storyboard.",
      imagePrompt:
        "A stack of dense papers transforming into a clean four-panel storyboard, clean editorial illustration, modern software explainer, high contrast, simple shapes, no text, 16:9.",
      imagePath: "",
      audioPath: ""
    },
    {
      id: "section-02",
      title: "The Problem",
      durationSeconds: 12,
      narration: "Most readers will never get through the whole thing.",
      onScreenText: "Attention is the bottleneck.",
      visualDescription: "A long scroll shrinking into a short video frame.",
      imagePrompt:
        "A long webpage scroll compressing into a short video frame, clean editorial illustration, modern software explainer, high contrast, simple shapes, no text, 16:9.",
      imagePath: "",
      audioPath: ""
    },
    {
      id: "section-03",
      title: "The Transformation",
      durationSeconds: 14,
      narration: "This workflow extracts the argument, turns it into scenes, and writes narration for each moment.",
      onScreenText: "Extract. Structure. Narrate.",
      visualDescription: "An assembly line turning text into scenes and audio.",
      imagePrompt:
        "A simple creative assembly line turning article text into video scenes and audio waves, clean editorial illustration, modern software explainer, high contrast, simple shapes, no text, 16:9.",
      imagePath: "",
      audioPath: ""
    },
    {
      id: "section-04",
      title: "The Output",
      durationSeconds: 12,
      narration: "The result is a production-ready explainer package that can become a video.",
      onScreenText: "Ready for video generation.",
      visualDescription: "A finished production folder with storyboard, images, and narration.",
      imagePrompt:
        "A polished production folder containing storyboard panels, image thumbnails, and audio tracks, clean editorial illustration, modern software explainer, high contrast, simple shapes, no text, 16:9.",
      imagePath: "",
      audioPath: ""
    }
  ]
};

const narration = {
  voice: process.env.OPENAI_TTS_VOICE ?? "alloy",
  sections: sections.sections.map((section) => ({
    id: section.id,
    text: section.narration,
    audioPath: section.audioPath
  }))
};

const manifest = {
  status: "text_package",
  notes: ["Placeholder artifacts created without media generation."],
  outputs: [
    { path: "artifacts/video-plan.md", type: "markdown" },
    { path: "artifacts/sections.json", type: "json" },
    { path: "artifacts/narration.json", type: "json" },
    { path: "artifacts/image-prompts.md", type: "markdown" },
    { path: "artifacts/preview.html", type: "html" }
  ],
  sections: sections.sections.map((section) => ({
    id: section.id,
    imagePath: section.imagePath,
    audioPath: section.audioPath
  }))
};

const imagePrompts = sections.sections
  .map((section) => `## ${section.id}: ${section.title}\n\n${section.imagePrompt}`)
  .join("\n\n");

const plan = `# ${sections.title}

${sections.sourceSummary}

${sections.sections
  .map(
    (section) => `## ${section.title}

- Duration: ${section.durationSeconds}s
- On-screen text: ${section.onScreenText}
- Visual: ${section.visualDescription}

Narration:

${section.narration}
`,
  )
  .join("\n")}
`;

await writeFile("artifacts/sections.json", `${JSON.stringify(sections, null, 2)}\n`);
await writeFile("artifacts/narration.json", `${JSON.stringify(narration, null, 2)}\n`);
await writeFile("artifacts/production-manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile("artifacts/image-prompts.md", `# Image Prompts\n\n${imagePrompts}\n`);
await writeFile("artifacts/video-plan.md", plan);

console.log("Created placeholder artifacts.");

