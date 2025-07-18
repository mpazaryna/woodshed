import { assertEquals } from "jsr:@std/assert";
import { createMediumReader } from "./reader_medium.ts";

Deno.test(
  "createMediumReader canHandle should return true for Medium URLs",
  () => {
    const reader = createMediumReader();

    const validUrl1 = "https://medium.com/some-article";
    const validUrl2 = "https://www.medium.com/some-article";
    const invalidUrl = "https://example.com/some-article";

    assertEquals(reader.canHandle(validUrl1), true);
    assertEquals(reader.canHandle(validUrl2), true);
    assertEquals(reader.canHandle(invalidUrl), false);
  }
);
