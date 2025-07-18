// <name> Shortcode Functions
// <description> Shortcodes are chat-based functions to aid in human-AI collaboration.
/*
<content>
	If shortcodes are included in a rules file, then the following instructions will be required
	<instructions> *Shortcodes* are functions which can be called by the human to accelerate development. Shortcodes are formatted as [[shortcode-name]]. If the human includes a shortcode in their message, you will only apply it to your next response. If any shortcodes have been applied, please begin your response with "ACTIVATED: {insert shortcode name}"

	Example shortcode prompts to add to this file
	<examples>
	- [[approval]] = Approval Mode. Do not write code blocks or apply code changes in your response. Instead propose a clear and concise approach in a step-by-step format outlining the changes you would make.
	- [[confident]] = Review the user request and all code available to you. Before proceeding with any development, you must gauge your confidence that you will be able to complete the request perfectly on a scale of 1-100. If this score is 80-100 then you may proceed with development. If this score is below 80, then you must ask clarifying questions to help improve your understanding.
	- [[no-mod]] = Ignore Modularization. The user is testing a feature and you should keep all components, types, interfaces, and any other modules contained to one file.

</content>
*/

import type { RulePrimitive } from "../../../src/core/types.ts";

interface Shortcode {
  name: string;
  description: string;
  instruction: string;
}

const systemMessage = `
<system>
You are an AI development assistant that supports shortcode functions. Shortcodes are special commands that modify your behavior for your next response only.
</system>`;

const contextMessage = `
<context>
When a user includes a shortcode in their message:
1. Only apply it to your next response
2. Begin your response with "ACTIVATED: {shortcode name}"
3. Follow the specific instructions for that shortcode
</context>

<format>
Shortcodes are activated using double brackets: [[shortcode-name]]
</format>`;

const shortcodes: Shortcode[] = [
  {
    name: "approval",
    description: "Approval Mode",
    instruction: "Do not write code blocks or apply code changes in your response. Instead propose a clear and concise approach in a step-by-step format outlining the changes you would make."
  },
  {
    name: "confident",
    description: "Confidence Check",
    instruction: "Review the user request and all code available to you. Before proceeding with any development, you must gauge your confidence that you will be able to complete the request perfectly on a scale of 1-100. If this score is 80-100 then you may proceed with development. If this score is below 80, then you must ask clarifying questions to help improve your understanding."
  },
  {
    name: "no-mod",
    description: "Ignore Modularization",
    instruction: "The user is testing a feature and you should keep all components, types, interfaces, and any other modules contained to one file."
  }
];

const formatShortcodes = (codes: Shortcode[]): string => {
  return `<shortcodes>\n${codes.map(code => `
  <shortcode name="${code.name}">
    <description>${code.description}</description>
    <instruction>${code.instruction}</instruction>
  </shortcode>`).join('\n')}\n</shortcodes>`;
};

const primitive: RulePrimitive = {
  id: "functions-shortcodes",
  type: "general",
  name: "Shortcode Functions",
  content: `${systemMessage}\n${contextMessage}\n${formatShortcodes(shortcodes)}`,
  metadata: {
    version: "1.0.0",
    lastUpdated: new Date().toISOString()
  }
};

export default primitive;