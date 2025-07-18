// Configuration for YouTube Ollama Extraction

// Ollama API settings
export const baseUrl = "http://localhost:11434";
//export const modelName = "llama3.2";
export const modelName = "qwen2.5:7b";

// Additional configuration options can be added here
export const config = {
  // Maximum chunk size for transcript processing (in characters)
  maxChunkSize: 6000,

  // Prompt templates directory
  promptsDir: "./prompts",

  // Maximum filename length
  maxFilenameLength: 100,

  // Response format options
  format: {
    // Use JSON format for structured data (entities, quotes, takeaways)
    // Set to false to use plain text format instead
    useJson: false, // Using plain text format for more reliable extraction

    // Segment processing options
    segmentDuration: 120, // Target duration for segments in seconds (2 minutes)

    // Output options
    outputDir: "./output",
  },
};
