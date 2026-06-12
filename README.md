# Article-to-Video Explainer Workflow

This repository is a starting filesystem for an AgentDrop workflow that turns a boring article into a short video explainer.

The intended run flow:

1. A user pastes article text into the workflow page.
2. The agent extracts the core argument.
3. The agent creates 4-5 video sections.
4. Each section gets narration, on-screen text, and an image prompt.
5. If credentials/tools are available, the agent generates images through Fal and narration through OpenAI TTS.
6. The final files are written under `artifacts/`.

This repo intentionally does not commit API keys. Configure keys in the cloud agent environment or replace the placeholder in `.cursor/mcp.json` before running with real media generation.

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

## Demo Mode

If media credentials are not available, still create the text production package. Run:

```bash
npm run placeholder
npm run preview
npm run validate
```

## Real Media Mode

When available:

- Use Cursor's configured `fal-ai` MCP server to generate section images.
- Use `OPENAI_API_KEY` with `npm run narration:openai` to generate narration MP3 files.
- Update `artifacts/production-manifest.json` with every generated asset path.
