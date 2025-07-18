export const createArticleError = (type: string, message: string) => ({
  type,
  message,
  timestamp: new Date().toISOString(),
});

export const ErrorTypes = {
  ARTICLE_NOT_FOUND: "ARTICLE_NOT_FOUND",
  CONTENT_EXTRACTION: "CONTENT_EXTRACTION",
  STORAGE: "STORAGE",
  VALIDATION: "VALIDATION",
  NETWORK: "NETWORK",
} as const;

export type ArticleError = ReturnType<typeof createArticleError>;
