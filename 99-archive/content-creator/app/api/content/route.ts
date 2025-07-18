import { NextResponse } from "next/server";
import { loadTemplate } from "@/lib/templateLoader";
import { getFileBySlug } from "@/lib/file-reader";
import { getApiKey, callOpenAI } from "@/lib/openai-utils";
import { processDharmaTemplate, processFileTemplate, processPromptTemplate } from "@/lib/template-utils";

/**
 * Unified content generation API endpoint
 *
 * This endpoint combines the functionality of both generate and generate-rag endpoints
 * into a single, more flexible API. It provides a consistent interface for generating
 * content from different sources using various templates.
 *
 * It supports two input modes:
 * 1. Direct prompt input (source: "prompt")
 * 2. File-based content (source: "file")
 *
 * Common parameters:
 * - source: "prompt" | "file" - The source of content
 * - templateType: The type of template to use (yoga, social, video, dharma, social-rag)
 * - templateName: The specific template to use (default: "default")
 * - tone: The tone of the generated content (default: "professional")
 * - length: The length of the generated content (default: "medium")
 *
 * Source-specific parameters:
 * - For "prompt" source: prompt (required) - The user's input text
 * - For "file" source: fileSlug (required) - The identifier for the content file
 *
 * Template-specific parameters:
 * - For "dharma" templates:
 *   - focus: Main topic of the dharma talk
 *   - style: Style of presentation
 *   - duration: Length of the talk in minutes
 *   - targetAudience: Intended audience
 *   - scriptureReference: Optional scripture reference
 *   - concept: Main teaching concept
 *
 * @example
 * // Request for prompt-based content
 * {
 *   "source": "prompt",
 *   "prompt": "Benefits of yoga for stress relief",
 *   "templateType": "social",
 *   "tone": "friendly",
 *   "length": "short"
 * }
 *
 * @example
 * // Request for file-based content
 * {
 *   "source": "file",
 *   "fileSlug": "yoga-benefits-article",
 *   "templateType": "social-rag",
 *   "tone": "professional",
 *   "length": "medium"
 * }
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
     * We extract common parameters, source-specific parameters, and template-specific parameters.
     * Default values are provided for optional parameters.
     */
    const {
      // Common parameters with defaults
      source = 'prompt',          // The source of content: 'prompt' or 'file'
      templateType = 'social',    // The type of template to use
      templateName = 'default',   // The specific template name
      tone = 'professional',      // The tone for the generated content
      length = 'medium',          // The desired length of the output

      // Source-specific parameters
      prompt,                     // Required for source='prompt'
      fileSlug,                   // Required for source='file'

      // Template-specific parameters for dharma talks
      focus,                      // Main topic of the dharma talk
      style,                      // Style of presentation
      duration,                   // Length of the talk in minutes
      targetAudience,             // Intended audience
      scriptureReference = '',    // Optional scripture reference
      concept                     // Main teaching concept
    } = requestBody;

    console.log('Parsed parameters:', {
      source, templateType, templateName, tone, length,
      prompt: prompt ? `${prompt.substring(0, 50)}...` : undefined,
      fileSlug,
      focus, style, duration, targetAudience, scriptureReference, concept
    });

    /**
     * Validate required parameters based on the content source
     *
     * Different sources require different parameters:
     * - 'prompt' source requires the 'prompt' parameter
     * - 'file' source requires the 'fileSlug' parameter
     */
    if (source === 'prompt' && !prompt) {
      return NextResponse.json({ error: "Prompt is required when source is 'prompt'" }, { status: 400 });
    }

    if (source === 'file' && !fileSlug) {
      return NextResponse.json({ error: "File slug is required when source is 'file'" }, { status: 400 });
    }

    // Load the template
    console.log(`Loading template: ${templateType}/${templateName}`);
    let template;
    try {
      template = await loadTemplate(templateType, templateName);
      console.log('Template loaded:', {
        systemPromptLength: template.systemPrompt.length,
        userPromptLength: template.userPrompt.length
      });
    } catch (templateError) {
      console.error('Error loading template:', templateError);
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    /**
     * Get content based on the specified source
     *
     * For 'file' source, we retrieve the file content and metadata.
     * For 'prompt' source, we use the prompt as the content.
     */
    let content = '';
    let title = '';
    let description = '';

    if (source === 'file') {
      // Get the file content
      const file = await getFileBySlug(fileSlug);
      if (!file) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      content = file.content;
      title = file.title;
      description = file.description;
      console.log(`File loaded: ${title}, content length: ${content.length}`);
    } else {
      // Use the prompt as content
      content = prompt;
      console.log(`Using prompt as content, length: ${content.length}`);
    }

    /**
     * Process the template with the appropriate variables
     *
     * We use different processing functions based on the template type and content source:
     * - For dharma templates: Special handling for dharma-specific variables
     * - For file-based content: Inject file content and metadata
     * - For prompt-based content: Inject the prompt and style parameters
     *
     * Each processing function returns the processed system and user prompts.
     */
    let processedTemplate;

    // Process template based on type and source
    if (templateType === 'dharma') {
      // Dharma templates have special variable handling
      processedTemplate = processDharmaTemplate(template, {
        focus,
        style,
        duration,
        targetAudience,
        scriptureReference,
        concept
      });
    } else if (source === 'file') {
      // Process template for file-based content
      processedTemplate = processFileTemplate(template, {
        content,
        title,
        description,
        tone,
        length
      });
    } else {
      // Process template for prompt-based content
      processedTemplate = processPromptTemplate(template, {
        prompt: content,
        tone,
        length
      });
    }

    const { systemPrompt, userPrompt } = processedTemplate;

    console.log('System prompt length:', systemPrompt.length);
    console.log('User prompt length:', userPrompt.length);

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
    console.log('OpenAI API call successful!');
    return NextResponse.json({ result: apiResponse.result });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
