/**
 * @fileOverview This file sets up a Hono server to handle API requests for primitives and mock compositions.
 * It includes routes for fetching primitives, serving a mock composition, and handling tag-based queries.
 * 
 * @module server
 */

import { Hono } from "https://deno.land/x/hono/mod.ts";
import { serveStatic } from "https://deno.land/x/hono/middleware.ts";
import { logger, cors } from "https://deno.land/x/hono/middleware.ts";
import { parse } from "https://deno.land/x/xml/mod.ts";
import { generateComposition } from "./ai_compose_facade.ts";

const app = new Hono();

/**
 * Middleware to enable CORS for all routes.
 */
app.use("/*", cors());

/**
 * GET /api/primitives
 * @summary Fetches the list of primitives from the autoindex.json file.
 * @returns {Object} JSON object containing the list of primitives or an error message.
 */
app.get("/api/primitives", async (c) => {
  try {
    const indexJson = await Deno.readTextFile("./data/idx/system/compute/index.json");
    return c.json(JSON.parse(indexJson));
  } catch (error) {
    console.error("Error reading index.json:", error);
    return c.json({ error: "Failed to load templates" }, 500);
  }
});

// mock composition result
/**
 * GET /mock/composition
 * @summary Serves a mock composition template in XML format.
 * @returns {string} XML content of the mock composition or an error message.
 */
app.get("/mock/composition", async (c) => {
  try {
    const template = await Deno.readTextFile("./data/tmp/aic.xml");
    c.header("Content-Type", "application/xml");
    return c.body(template);
  } catch (error) {
    console.error("Error reading stack:", error);
    return c.json({ error: "Failed to read stack" }, 500);
  }
});

/**
 * POST /api/primitives/tag
 * @summary Filters primitives based on the provided tags.
 * @param {Object} c - The context object containing the request and response.
 * @returns {Object} JSON object containing matching primitives or an error message.
 */
app.post('/api/primitives/tag', async (c) => {
    try {
        const body = await c.req.json();
        const inputTags = body.tags;
        
        if (!Array.isArray(inputTags)) {
            return c.json({ error: 'Tags should be an array' }, 400);
        }

        const indexJson = await Deno.readTextFile("./data/idx/system/compute/index.json");
        const autoindex = JSON.parse(indexJson);

        const matchingPrimitives = autoindex.primitives.filter(primitive => 
            primitive.tags.some(tag => inputTags.includes(tag))
        );

        // Create meta section
        const response = {
            meta: {
                tags: inputTags,
                version: "1.0",
                generated: new Date().toISOString(),
                count: matchingPrimitives.length
            },
            primitives: matchingPrimitives
        };

        return c.json(response);
    } catch (error) {
        console.error("Error processing request:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

/**
 * POST /api/composition/generate
 * @summary Generates a composition based on the provided prompt
 * @returns {string} Generated XML composition
 */
app.post('/api/composition/generate', async (c) => {
  try {
    const body = await c.req.json();
    const { prompt } = body;

    if (!prompt) {
      return c.json({ error: 'Prompt is required' }, 400);
    }

    const composition = await generateComposition(prompt);
    
    c.header('Content-Type', 'application/xml');
    return c.body(composition);
    
  } catch (error) {
    console.error("Error generating composition:", error);
    return c.json({ error: "Failed to generate composition" }, 500);
  }
});

// Start the server
const port = 3000;
console.log(`Server running on http://localhost:${port}`);

Deno.serve({ port }, app.fetch); 