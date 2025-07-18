// article_service.ts
import { createArticleError, ErrorTypes } from "./errors.ts";
import { ArticleReader, FetchResult, ReaderConfig } from "./types.ts";
import { createMediumReader } from "./reader_medium.ts";

export const findReader = (readers: ArticleReader[], source: string) =>
  readers.find((r) => r.canHandle(source));

export const createArticleService = (config: ReaderConfig) => {
  const readers = [
    createMediumReader(),
    // Add more readers here
  ];

  const fetchArticle = (source: string): Promise<FetchResult> => {
    const reader = findReader(readers, source);

    if (!reader) {
      return Promise.resolve({
        ok: false,
        error: createArticleError(
          ErrorTypes.VALIDATION,
          "No compatible reader found for the given source"
        ),
      });
    }

    return reader.fetchArticle(source, config);
  };

  return { fetchArticle };
};
