import { Anthropic } from "npm:@anthropic-ai/sdk";

export class ClaudeService {
  private anthropic: Anthropic;

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey });
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      console.log("Calling Claude API...");
      const message = await this.anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      });

      return message.content[0].text;
    } catch (error) {
      console.error("Error calling Claude API:", error);
      throw error;
    }
  }
} 