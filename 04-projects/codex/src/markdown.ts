// markdown.ts

const normalizeWhitespace = (text: string): string => {
  return text
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/[ \t]+/g, " ")
    .trim();
};

const cleanupMarkdown = (content: string): string => {
  let cleaned = content;
  const patterns = [
    /Source\s*:\s*[^\n]+/g,
    /Share\s+More/g,
    /Listen\s+Share/g,
    /\[[\s\S]*?\]\(https?:\/\/[^\)]+source=post_page[^\)]*\)/g,
    /\[\s*\]\([^\)]+\)/g,
    /\[@[^\]]+\]/g,
    /Published in[\s\S]*?·/g,
    /Open in app/g,
    /Member-only story/g,
    /\d+ min read/g,
  ];

  patterns.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, "");
  });

  // Handle emoji titles with proper spacing
  cleaned = cleaned.replace(/([^\s])([🚀🤖🧠💻📱📰🌱🖍️📔🖌])/g, "$1 $2");
  cleaned = cleaned.replace(/([🚀🤖🧠💻📱📰🌱🖍️📔🖌])([^\s])/g, "$1 $2");

  // Normalize whitespace
  cleaned = cleaned
    // Replace multiple spaces with a single space
    .replace(/ +/g, " ")
    // Normalize newlines
    .replace(/\n{3,}/g, "\n\n")
    // Remove leading/trailing whitespace from each line
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    // Remove leading/trailing whitespace from the entire text
    .trim();

  return cleaned;
};

export const htmlToMarkdown = (html: string): string => {
  // Remove extra whitespace between tags
  let markdown = html.replace(/>\s+</g, "><");

  // Remove unnecessary divs and spans that might add extra spacing
  markdown = markdown
    .replace(/<div[^>]*>/gi, "")
    .replace(/<\/div>/gi, "\n")
    .replace(/<span[^>]*>/gi, "")
    .replace(/<\/span>/gi, "");

  // Handle headings
  markdown = markdown.replace(
    /<h([1-6])[^>]*>(.*?)<\/h\1>/gi,
    (_, level, content) => {
      return `\n\n${"#".repeat(parseInt(level))} ${normalizeWhitespace(
        content
      )}\n\n`;
    }
  );

  // Handle paragraphs
  markdown = markdown.replace(
    /<p[^>]*>(.*?)<\/p>/gi,
    (_, content) => `\n\n${normalizeWhitespace(content)}\n\n`
  );

  // Handle lists
  markdown = markdown
    .replace(/<ul[^>]*>(.*?)<\/ul>/gis, (_, content) => `\n${content}\n`)
    .replace(/<ol[^>]*>(.*?)<\/ol>/gis, (_, content) => `\n${content}\n`)
    .replace(
      /<li[^>]*>(.*?)<\/li>/gi,
      (_, content) => `- ${normalizeWhitespace(content)}\n`
    );

  // Handle formatting
  markdown = markdown
    .replace(
      /<(b|strong)[^>]*>(.*?)<\/\1>/gi,
      (_, __, content) => `**${content}**`
    )
    .replace(/<(i|em)[^>]*>(.*?)<\/\1>/gi, (_, __, content) => `*${content}*`);

  // Handle links
  markdown = markdown.replace(
    /<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi,
    (_, url, text) => `[${normalizeWhitespace(text)}](${url})`
  );

  // Handle images
  markdown = markdown.replace(
    /<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi,
    (_, src, alt) => `\n\n![${alt}](${src})\n\n`
  );

  // Handle line breaks
  markdown = markdown.replace(/<br\s*\/?>/gi, "\n");

  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]+>/g, " ");

  // Decode HTML entities
  markdown = markdown
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–");

  return cleanupMarkdown(markdown)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};
