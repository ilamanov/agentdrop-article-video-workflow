import { readFile, writeFile } from "node:fs/promises";

const sections = JSON.parse(await readFile("artifacts/sections.json", "utf8"));

const sectionHtml = sections.sections
  .map(
    (section) => `<section>
  <h2>${escapeHtml(section.title)}</h2>
  <p><strong>${section.durationSeconds}s</strong> - ${escapeHtml(section.onScreenText)}</p>
  <p>${escapeHtml(section.narration)}</p>
  <pre>${escapeHtml(section.imagePrompt)}</pre>
</section>`,
  )
  .join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(sections.title)}</title>
  <style>
    body { font-family: ui-sans-serif, system-ui, sans-serif; margin: 40px; color: #18181b; line-height: 1.5; }
    main { max-width: 880px; margin: 0 auto; }
    section { border-top: 1px solid #d4d4d8; padding: 24px 0; }
    pre { white-space: pre-wrap; background: #f4f4f5; padding: 16px; border-radius: 8px; }
  </style>
</head>
<body>
  <main>
    <h1>${escapeHtml(sections.title)}</h1>
    <p>${escapeHtml(sections.sourceSummary)}</p>
    ${sectionHtml}
  </main>
</body>
</html>
`;

await writeFile("artifacts/preview.html", html);
console.log("Built artifacts/preview.html.");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

