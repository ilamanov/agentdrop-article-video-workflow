Turn the pasted article into a short video explainer.

Inputs:

- Audience: {{audience}}
- Tone: {{tone}}
- Length: {{length}}
- Visual style: {{visual_style}}
- Call to action: {{call_to_action}}

Article:

{{article}}

Create a 4-5 section video package. Each section should have narration, on-screen text, visual direction, and an image prompt.

Write all final files under `artifacts/`.

Execution notes:

- AgentDrop provides the Fal MCP server and OpenAI credentials to the Cursor cloud run.
- Generate one image per section with Fal and save the images under `artifacts/images/`.
- Generate narration audio with `npm run narration:openai`.
- Assemble the final MP4 with `npm run video:assemble`.
- Build `preview.html` with `npm run preview`.
- Do not silently downgrade to a text-only package. If a media credential or tool is missing, fail visibly and explain what is missing.
- Run `npm run validate` before finishing.
