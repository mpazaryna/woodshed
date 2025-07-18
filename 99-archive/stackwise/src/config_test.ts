import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { domainConfigs, config } from "./config.ts";

Deno.test("Configuration validation", async (t) => {
  await t.step("domainConfigs contains expected domains", () => {
    const expectedDomains = ["compute", "finance", "wellness"];
    assertEquals(Object.keys(domainConfigs).sort(), expectedDomains.sort());
  });

  await t.step("all domains have required properties", () => {
    for (const domain of Object.values(domainConfigs)) {
      assertEquals(typeof domain.name, "string");
      assertEquals(typeof domain.description, "string");
      assertEquals(Array.isArray(domain.categories), true);
      assertEquals(typeof domain.defaultTemplate, "string");
      assertEquals(typeof domain.templateMappings, "object");
    }
  });
});