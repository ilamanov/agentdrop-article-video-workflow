# Article-to-Video Explainer Workflow

This repository is a starting filesystem for an AgentDrop workflow that turns a boring article into a short video explainer.

The intended run flow:

1. A user pastes article text into the workflow page.
2. The agent extracts the core argument.
3. The agent creates 4-5 video sections.
4. Each section gets narration, on-screen text, and an image prompt.
5. The agent generates images through Fal and narration through OpenAI TTS.
6. The agent assembles the generated media into `artifacts/final-video.mp4`.
7. The final files are written under `artifacts/`.

This repo intentionally does not commit API keys. AgentDrop passes the Fal MCP server config and OpenAI/Fal environment variables into the Cursor cloud run. See `.cursor/mcp.example.json` only if you want to run the workflow outside AgentDrop.

## AgentDrop Inputs

Recommended workflow inputs:

- `article`: textarea
- `audience`: text or select
- `tone`: select
- `length`: select
- `visual_style`: select
- `call_to_action`: optional text

Recommended output paths:

- `artifacts/video-plan.md`
- `artifacts/sections.json`
- `artifacts/narration.json`
- `artifacts/image-prompts.md`
- `artifacts/production-manifest.json`
- `artifacts/preview.html`
- `artifacts/final-video.mp4`

## Real Media Mode

Run:

```bash
npm install
npm run narration:openai
npm run video:assemble
npm run preview
npm run validate
```

Use Cursor's configured `fal-ai` MCP server to generate section images before running the narration and assembly scripts. If Fal MCP or OpenAI credentials are missing, fail visibly instead of creating a text-only result.
