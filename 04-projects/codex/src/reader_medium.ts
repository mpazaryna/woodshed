// reader_medium.ts
import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import {
  ArticleReader,
  ArticleMetadata,
  FetchResult,
  ReaderConfig,
} from "./types.ts";
import { saveArticle } from "./storage.ts";
import { htmlToMarkdown } from "./markdown.ts";
import { createArticleError, ErrorTypes } from "./errors.ts";

/**
 * Creates a Medium article reader.
 * @returns {ArticleReader} The Medium article reader instance.
 */
export const createMediumReader = (): ArticleReader => ({
  /**
   * Checks if the given URL can be handled by this reader.
   * @param {string} url - The URL to check.
   * @returns {boolean} True if the URL can be handled, false otherwise.
   */
  canHandle: (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return (
        urlObj.hostname.includes("medium.com") || url.includes("medium.com")
      );
    } catch {
      return false;
    }
  },

  /**
   * Fetches an article from Medium.
   * @param {string} url - The URL of the Medium article.
   * @param {ReaderConfig} config - The configuration for the reader.
   * @returns {Promise<FetchResult>} The result of the fetch operation.
   */
  fetchArticle: async (
    url: string,
    config: ReaderConfig
  ): Promise<FetchResult> => {
    try {
      console.log("Fetching Medium article from:", url);

      const response = await fetchWithHeaders(url, config.cookies);
      if (!response.ok) {
        return {
          ok: false,
          error: createArticleError(
            ErrorTypes.NETWORK,
            `HTTP error! status: ${response.status}`
          ),
        };
      }

      const html = await response.text();
      console.log("Successfully fetched HTML content");

      const metadata = extractMetadata(html, url);
      console.log("Extracted metadata:", metadata);

      const content = extractContent(html);
      console.log("Successfully extracted content");

      const markdown = htmlToMarkdown(content);
      console.log("Converted to markdown");

      const { fileName, filePath } = await saveArticle(
        metadata,
        markdown,
        config.outputDir
      );
      console.log("Saved article to:", filePath);

      return {
        ok: true,
        value: {
          fileName,
          metadata,
          filePath,
        },
      };
    } catch (error) {
      console.error("Error fetching article:", error.message);
      return {
        ok: false,
        error: createArticleError(ErrorTypes.CONTENT_EXTRACTION, error.message),
      };
    }
  },
});

/**
 * Fetches a resource with specified headers.
 * @param {string} url - The URL to fetch.
 * @param {string} cookies - The cookies to include in the request.
 * @returns {Promise<Response>} The response from the fetch operation.
 */
const fetchWithHeaders = async (
  url: string,
  cookies: string
): Promise<Response> => {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    Cookie: cookies,
  };

  return await fetch(url, { headers });
};

/**
 * Extracts metadata from the given HTML content.
 * @param {string} html - The HTML content of the article.
 * @param {string} url - The URL of the article.
 * @returns {ArticleMetadata} The extracted metadata.
 * @throws {Error} If the HTML cannot be parsed.
 */
const extractMetadata = (html: string, url: string): ArticleMetadata => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  if (!doc) throw new Error("Failed to parse HTML");

  // More robust title extraction
  const title =
    doc.querySelector("h1")?.textContent?.trim() ||
    doc.querySelector('meta[property="og:title"]')?.getAttribute("content") ||
    doc.querySelector('meta[name="title"]')?.getAttribute("content") ||
    "Untitled";

  // More robust author extraction with multiple fallbacks
  let author =
    doc.querySelector('meta[name="author"]')?.getAttribute("content") ||
    doc.querySelector('a[data-testid="authorName"]')?.textContent?.trim() ||
    doc.querySelector('a[rel="author"]')?.textContent?.trim() ||
    doc.querySelector(".author-name")?.textContent?.trim() ||
    doc
      .querySelector('meta[property="article:author"]')
      ?.getAttribute("content");

  // Filter out invalid author values
  if (
    !author ||
    author === "Open in app" ||
    author === "More from" ||
    author.length < 2
  ) {
    author = "Unknown Author";
  }

  // More robust date extraction
  const publishDate =
    doc
      .querySelector('meta[property="article:published_time"]')
      ?.getAttribute("content") ||
    doc.querySelector("time[datetime]")?.getAttribute("datetime") ||
    new Date().toISOString();

  return {
    title,
    author,
    source: url,
    publishDate,
    dateSaved: new Date().toISOString(),
  };
};

/**
 * Extracts the main content from the given HTML.
 * @param {string} html - The HTML content of the article.
 * @returns {string} The extracted content.
 * @throws {Error} If the content cannot be extracted.
 */
const extractContent = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  if (!doc) throw new Error("Failed to parse HTML");

  // Clean up the DOM first
  const elementsToRemove = [
    "script",
    "noscript",
    "style",
    ".metabar",
    ".postMetaInline",
    ".js-postShareWidget",
    ".progressiveMedia",
    ".graf-spacer",
    ".js-closeButton",
    ".overlay",
    ".loadingBar",
    "[aria-label='Post Preview Image']",
    ".signup-cta",
    ".u-paddingTop10",
    ".section-divider",
    ".uiScale",
  ];

  elementsToRemove.forEach((selector) => {
    doc.querySelectorAll(selector).forEach((node) => {
      if (node instanceof Element) {
        node._remove();
      }
    });
  });

  // Try multiple selectors to find the main content
  const contentSelectors = [
    "article",
    ".section-content",
    ".post-content",
    ".story",
    'div[data-field="body"]',
    ".prose",
    "main",
    "#root article",
    ".article-content",
  ];

  let content = "";
  for (const selector of contentSelectors) {
    const element = doc.querySelector(selector);
    if (element?.innerHTML) {
      content = element.innerHTML;
      console.log(`Found content using selector: ${selector}`);
      break;
    }
  }

  // If no content found, try to get all paragraphs
  if (!content) {
    const paragraphs = doc.querySelectorAll("p");
    if (paragraphs.length > 0) {
      content = Array.from(paragraphs)
        .map((p) => p.outerHTML)
        .join("\n");
      console.log("Extracted content from paragraphs");
    }
  }

  if (!content) {
    // Before throwing error, log some debug info
    console.error(
      "Available elements in document:",
      Array.from(doc.querySelectorAll("*"))
        .map((el) => el.tagName)
        .join(", ")
    );
    throw new Error("Could not extract article content");
  }

  return content;
};
