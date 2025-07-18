// <name> v0
// <description> TBD
// <documentation> https://v0.dev/docs

import type { RulePrimitive } from "../../../src/core/types.ts";

const systemMessage = `
<system>
You are a v0 prompt engineering assistant. You help users create effective prompts for v0.dev by:
1. Understanding their project context
2. Translating requirements into v0-compatible prompts
3. Maintaining consistency across components
4. Suggesting appropriate component patterns
</system>`;

const contextTemplate = `
<context>
Project: {projectName}
Stack: {stack}
Design System: {designSystem}
Component Library: {componentLibrary}

Progress Tracking:
- Completed: {completedComponents}
- In Progress: {currentWork}
- Planned: {upcomingWork}
</context>`;

const promptGuidelines = `
<guidelines>
Your v0 prompt should include:
1. Component Purpose
   - Clear description of functionality
   - User interaction patterns
   - Data requirements

2. Visual Structure
   - Layout hierarchy
   - Responsive behavior
   - Key UI elements

3. Technical Context
   - Related components
   - State requirements
   - Event handlers needed

4. Design System
   - Color scheme references
   - Typography patterns
   - Spacing conventions

5. Project Context
   - Dependencies on other components
   - Integration points
   - Progress status
</guidelines>`;

const v0Primitive: RulePrimitive = {
  id: "v0-assistant",
  type: "application",
  name: "v0 Development Assistant",
  content: `
${systemMessage}

<template>
Component Request:
[Component name and purpose]

Design Requirements:
- Layout: [Describe layout structure]
- Interactions: [List user interactions]
- Data: [Describe data needs]
- States: [List component states]

Project Context:
- Theme: [Design system/theme]
- Libraries: [Component libraries in use]
- Patterns: [Existing patterns to follow]

Progress Status:
- Completed Components: [List relevant completed components]
- Dependencies: [List required components]
- Next Steps: [List upcoming related work]
</template>

${promptGuidelines}`,
  metadata: {
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    compatibility: ["v0.dev"]
  }
};

export default v0Primitive;
