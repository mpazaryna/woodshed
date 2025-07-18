import { NextResponse } from "next/server";
import { loadTemplate, processTemplate } from "@/lib/templateLoader";
import { getFileBySlug } from "@/lib/file-reader";
import { getApiKey, callOpenAI } from "@/lib/openai-utils";

/**
 * API route handler for RAG-based content generation
 *
 * This endpoint generates content using OpenAI's API based on existing content files.
 * It uses a Retrieval-Augmented Generation (RAG) approach by retrieving content from
 * the file system and using it as context for the generation.
 *
 * Request parameters:
 * - fileSlug: The slug of the file to use as context (required)
 * - templateType: The type of template to use (default: 'social-rag')
 * - templateName: The specific template name to use (default: 'default')
 * - tone: The tone of the generated content (default: 'professional')
 * - length: The length of the generated content (default: 'medium')
 *
 * @param request The incoming HTTP request
 * @returns JSON response with generated content or error message
 */
export async function POST(request: Request) {
  try {
    // Debug logging for environment variables
    console.log('Environment variable check:');
    console.log('- NEXT_PUBLIC_OPENAI_API_KEY exists:', !!process.env.NEXT_PUBLIC_OPENAI_API_KEY);
    console.log('- OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);

    const apiKey = getApiKey();
    if (!apiKey) {
      return NextResponse.json({ error: "API configuration error" }, { status: 500 });
    }

    // Parse the request body
    const requestBody = await request.json();
    console.log('Request body:', JSON.stringify(requestBody));

    /**
     * Extract parameters from the request body
     *
     * - fileSlug: The identifier for the content file to use
     * - templateType: The category of template to use
     * - templateName: The specific template within the category
     * - tone: The tone for the generated content
     * - length: The desired length of the output
     */
    const {
      fileSlug,
      templateType = 'social-rag',
      templateName = 'default',
      tone = 'professional',
      length = 'medium',
    } = requestBody;

    console.log('Parsed parameters:', {
      templateType, templateName, fileSlug, tone, length
    });

    /**
     * Validate and retrieve the file content
     *
     * The fileSlug parameter is required to identify which content file to use.
     * We retrieve the file content from the file system using the getFileBySlug utility.
     */
    // Validate required parameters
    if (!fileSlug) {
      return NextResponse.json({ error: "File slug is required" }, { status: 400 });
    }

    // Get the file content
    const file = await getFileBySlug(fileSlug);

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    /**
     * Load the template for content generation
     *
     * Templates are stored as markdown files with frontmatter metadata.
     * They contain system and user prompts for the AI model.
     */
    console.log(`Loading template: ${templateType}/${templateName}`);
    const template = await loadTemplate(templateType, templateName);

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    /**
     * Process the template with the file content and parameters
     *
     * We inject the file content, metadata, and user-specified parameters
     * into the template to create the final prompts for the AI model.
     */
    const systemPrompt = template.systemPrompt;
    let userPrompt;

    console.log(`Processing ${templateType} template with tone: ${tone}, length: ${length}`);
    userPrompt = processTemplate(template.userPrompt, {
      content: file.content,
      title: file.title,
      description: file.description,
      tone,
      length
    });

    /**
     * Call the OpenAI API to generate content
     *
     * We use the utility function from openai-utils.ts which handles:
     * - API key validation
     * - Making the API request with appropriate parameters
     * - Error handling
     * - Response processing
     */
    const apiResponse = await callOpenAI(systemPrompt, userPrompt, templateType, length);

    // Handle any errors from the API call
    if (apiResponse.error) {
      return NextResponse.json({ error: apiResponse.error }, { status: apiResponse.status || 500 });
    }

    // Return the generated content
    const responseData = { result: apiResponse.result };
    console.log('Response object:', responseData);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
