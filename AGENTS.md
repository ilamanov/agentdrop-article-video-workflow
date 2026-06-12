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

If media generation tools and credentials are available, also create:

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

If video assembly is available, create:

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
6. Generate media if the tools are configured.
7. Build `preview.html`.
8. Run `npm run validate`.

## Media Tooling

Use Cursor's `fal-ai` MCP server when it is available. Inspect the available Fal tools before choosing models. Prefer fast, reliable generation over maximum quality for demo runs.

For narration, if `OPENAI_API_KEY` is available, write `artifacts/narration.json` first and then run:

```bash
npm run narration:openai
```

If Fal or OpenAI credentials are missing, do not fail the workflow. Produce the full production package with image prompts and a clear note in `production-manifest.json`.

## Style Rules

Use the references in `workflow/reference/`:

- `content-rules.md`
- `visual-style.md`
- `narration-style.md`

Use the schemas in `workflow/schemas/` for JSON output shape.
