// types.ts
import { ArticleError } from "./errors.ts";

export type ArticleMetadata = {
  title: string;
  author: string;
  source: string;
  publishDate: string;
  dateSaved: string;
};

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: ArticleError };

export type FetchResult = Result<{
  fileName: string;
  metadata: ArticleMetadata;
  filePath: string;
}>;

export type ReaderConfig = {
  outputDir: string;
  cookies: string;
};

export type ArticleReader = {
  canHandle: (source: string) => boolean;
  fetchArticle: (source: string, config: ReaderConfig) => Promise<FetchResult>;
};
