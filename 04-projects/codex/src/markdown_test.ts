import { assertEquals } from "jsr:@std/assert";
import { htmlToMarkdown } from "./markdown.ts";

Deno.test("htmlToMarkdown should convert HTML to Markdown correctly", () => {
  const htmlInput = `
    <h1>Title</h1>
    <p>This is a <strong>test</strong> paragraph.</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  `;

  const expectedMarkdown = `
# Title

This is a **test** paragraph.

- Item 1
- Item 2
`.trim();

  const result = htmlToMarkdown(htmlInput);
  assertEquals(result, expectedMarkdown);
});
