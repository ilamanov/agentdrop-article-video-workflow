# Agent Instructions

You are running an Article-to-Video Explainer workflow.

Your job is to transform the user's pasted article text into a short video production package. Use the article as the source of truth. Do not invent claims beyond what the article supports.

## Required Outputs

Always write these files:

- `artifacts/video-plan.md`
- `artifacts/sections.json`
- `artifacts/narration.json`
- `artifacts/image-prompts.md`
- `artifacts/production-manifest.json`
- `artifacts/preview.html`

For AgentDrop runs, media generation credentials are expected to be available. Also create:

- `artifacts/images/section-01.png`
- `artifacts/images/section-02.png`
- `artifacts/images/section-03.png`
- `artifacts/images/section-04.png`
- `artifacts/images/section-05.png` when needed
- `artifacts/audio/section-01.mp3`
- `artifacts/audio/section-02.mp3`
- `artifacts/audio/section-03.mp3`
- `artifacts/audio/section-04.mp3`
- `artifacts/audio/section-05.mp3` when needed

Always assemble the final video:

- `artifacts/final-video.mp4`

## Workflow

1. Read the user's article from the prompt.
2. Identify the main claim, supporting points, and any surprising details.
3. Choose 4 or 5 sections based on article complexity.
4. For each section, write:
   - section title
   - concise narration
   - on-screen text
   - visual description
   - image generation prompt
   - estimated duration
5. Keep narration natural and spoken. Avoid article-like prose.
6. Run `npm install` if dependencies are not installed.
7. Use Fal MCP to generate one image per section and save each image locally under `artifacts/images/`.
8. Run `npm run narration:openai` to generate one MP3 per section under `artifacts/audio/`.
9. Run `npm run video:assemble` to create `artifacts/final-video.mp4`.
10. Run `npm run preview` to build `preview.html`.
11. Run `npm run validate`.

## Media Tooling

Use Cursor's `fal-ai` MCP server. Inspect the available Fal tools before choosing models. Prefer fast, reliable generation over maximum quality for demo runs.

Recommended image model: use a fast image generation model suitable for clean 16:9 editorial illustrations. For each section:

1. Call Fal through the `fal-ai` MCP server with the section's `imagePrompt`.
2. Download the returned image URL into `artifacts/images/{section-id}.png`.
3. Set that path as `imagePath` in `artifacts/sections.json`.

For narration, write `artifacts/narration.json` first and then run:

```bash
npm run narration:openai
```

If Fal MCP or OpenAI credentials are missing, fail visibly and explain which credential/tool is missing. Do not silently downgrade to a text-only package for AgentDrop runs.

## Style Rules

Use the references in `workflow/reference/`:

- `content-rules.md`
- `visual-style.md`
- `narration-style.md`

Use the schemas in `workflow/schemas/` for JSON output shape.
