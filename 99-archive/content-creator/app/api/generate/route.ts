import { NextResponse } from "next/server"
import { loadTemplate, processTemplate } from "@/lib/templateLoader"
import { getApiKey, callOpenAI } from "@/lib/openai-utils"

/**
 * API route handler for content generation based on templates and prompts
 *
 * This endpoint generates content using OpenAI's API based on templates and user prompts.
 * It supports various template types including yoga, video, social, and dharma talks.
 *
 * Request parameters:
 * - prompt: The user's input prompt for content generation
 * - templateType: The type of template to use (yoga, video, social, dharma)
 * - templateName: The specific template name to use (default: 'default')
 * - tone: The tone of the generated content (default: 'professional')
 * - length: The length of the generated content (default: 'medium')
 *
 * For dharma talks, additional parameters are required:
 * - focus: The main focus or topic of the dharma talk
 * - style: The style of the dharma talk
 * - duration: The duration of the talk in minutes
 * - targetAudience: The intended audience for the talk
 * - scriptureReference: Optional reference to scripture
 * - concept: The main concept or teaching to convey
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
    // Log first few characters of the API key if it exists (for debugging)
    if (apiKey) {
      const firstFewChars = apiKey.substring(0, 5) + '...';
      console.log(`API key found (starts with: ${firstFewChars})`);
    } else {
      return NextResponse.json({ error: "API configuration error" }, { status: 500 });
    }

    // Parse the request body
    const requestBody = await request.json();
    console.log('Request body:', JSON.stringify(requestBody));

    /**
     * Extract parameters from the request body
     *
     * Common parameters:
     * - prompt: The user's input text
     * - templateType: The type of template to use
     * - templateName: The specific template name
     * - tone: The tone for the generated content
     * - length: The desired length of the output
     *
     * Dharma-specific parameters:
     * - focus: Main topic of the dharma talk
     * - style: Style of presentation
     * - duration: Length of the talk in minutes
     * - targetAudience: Intended audience
     * - scriptureReference: Optional scripture reference
     * - concept: Main teaching concept
     */
    const {
      prompt,
      templateType = 'yoga',
      templateName = 'default',
      // Parameters for social media posts
      tone = 'professional',
      length = 'medium',
      // Additional parameters for dharma talks
      focus,
      style,
      duration,
      targetAudience,
      scriptureReference = '',
      concept
    } = requestBody;

    console.log('Parsed parameters:', {
      templateType, templateName, prompt, tone, length, focus, style, duration, targetAudience, scriptureReference, concept
    });

    // Load the template
    console.log(`Loading template: ${templateType}/${templateName}`);
    let template;
    try {
      template = await loadTemplate(templateType, templateName);
      console.log('Template loaded:', {
        systemPromptLength: template.systemPrompt.length,
        userPromptLength: template.userPrompt.length,
        userPromptStart: template.userPrompt.substring(0, 50),
        userPromptEnd: template.userPrompt.substring(template.userPrompt.length - 50)
      });
    } catch (templateError) {
      console.error('Error loading template:', templateError);
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    /**
     * Process the system prompt by injecting variables
     *
     * For dharma templates, we replace template variables with actual values.
     * For other template types, we use the system prompt as-is.
     */
    let systemPrompt = template.systemPrompt;
    if (templateType === 'dharma') {
      // Process system prompt with variables for dharma templates
      systemPrompt = systemPrompt
        .replace(/\${focus}/g, focus || '')
        .replace(/\${style}/g, style || '')
        .replace(/\${duration}/g, duration || '')
        .replace(/\${targetAudience}/g, targetAudience || '')
        .replace(/\${scriptureReference}/g, scriptureReference || '')
        .replace(/\${concept}/g, concept || '');
    }
    console.log('System prompt length:', systemPrompt.length);
    console.log('System prompt first 100 chars:', systemPrompt.substring(0, 100));

    /**
     * Process the user prompt based on template type
     *
     * Different template types require different processing:
     * - yoga: Simple prompt replacement
     * - video/social: Prompt, tone, and length replacement
     * - dharma: Complex variable replacement including mathematical expressions
     * - others: Default fallback to the original template
     */
    let userPrompt;

    if (templateType === 'yoga') {
      // Yoga templates only need the prompt variable
      console.log(`Processing ${templateType} template`);
      userPrompt = processTemplate(template.userPrompt, { prompt });
    } else if (templateType === 'video') {
      // Video templates use prompt, tone, and length
      console.log(`Processing ${templateType} template with tone: ${tone}, length: ${length}`);
      userPrompt = processTemplate(template.userPrompt, { prompt, tone, length });
    } else if (templateType === 'social') {
      // Social templates use prompt, tone, and length
      console.log(`Processing ${templateType} template with tone: ${tone}, length: ${length}`);
      userPrompt = processTemplate(template.userPrompt, { prompt, tone, length });
    } else if (templateType === 'dharma') {
      // Dharma templates require special handling with multiple variables
      console.log('Processing dharma template with variables:', {
        focus, style, duration, targetAudience, scriptureReference, concept
      });

      // Check if all required variables are present
      const requiredVars = ['focus', 'style', 'duration', 'targetAudience', 'concept'];
      const missingVars = requiredVars.filter(v => {
        const value = eval(v); // Use eval to access the variable by name
        return !value || value.trim() === '';
      });
      if (missingVars.length > 0) {
        console.error('Missing required variables:', missingVars);
      }

      // Manually process the template to ensure all variables are replaced
      let processedUserPrompt = template.userPrompt;

      // Replace Math.round expressions first for time calculations
      if (duration) {
        const durationNum = parseInt(duration) || 10;
        processedUserPrompt = processedUserPrompt
          .replace(/\${Math\.round\(parseInt\(duration\) \* 0\.1\)}/g, Math.round(durationNum * 0.1).toString())
          .replace(/\${Math\.round\(parseInt\(duration\) \* 0\.6\)}/g, Math.round(durationNum * 0.6).toString())
          .replace(/\${Math\.round\(parseInt\(duration\) \* 0\.2\)}/g, Math.round(durationNum * 0.2).toString());
      }

      // Replace other variables
      processedUserPrompt = processedUserPrompt
        .replace(/\${focus}/g, focus || '')
        .replace(/\${style}/g, style || '')
        .replace(/\${duration}/g, duration || '')
        .replace(/\${targetAudience}/g, targetAudience || '')
        .replace(/\${scriptureReference}/g, scriptureReference || '')
        .replace(/\${concept}/g, concept || '');

      userPrompt = processedUserPrompt;

      console.log('Manually processed user prompt, length:', userPrompt.length);
      console.log('First 100 chars:', userPrompt.substring(0, 100));
    } else {
      // Default fallback for unknown template types
      console.log('Using default template fallback');
      userPrompt = template.userPrompt; // Default fallback
    }

    console.log('User prompt length:', userPrompt.length);
    console.log('User prompt first 100 chars:', userPrompt.substring(0, 100));
    console.log('User prompt last 100 chars:', userPrompt.substring(Math.max(0, userPrompt.length - 100)));

    // Check if the user prompt is too short (likely truncated)
    if (userPrompt.length < 200 && templateType === 'dharma') {
      console.warn('User prompt seems too short for a dharma template. Using full template text.');
      // Use the full template text as a fallback
      userPrompt = template.userPrompt;
      console.log('Updated user prompt length:', userPrompt.length);
    }

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
