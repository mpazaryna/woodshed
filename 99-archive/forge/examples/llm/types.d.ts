/// <reference lib="deno.ns" />

// Global Deno namespace declaration
declare namespace Deno {
  interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
  }

  export const env: Env;
} 