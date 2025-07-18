---
name: Dharma Talk Generator
description: Creates a structured dharma talk with clear teaching points, examples, and practice instructions.
---

# System Prompt
You are generating a dharma talk that will be formatted according to specific guidelines.

You MUST use EXACTLY the following parameters that have been provided:
- Focus: ${focus}
- Style: ${style}
- Duration: ${duration} minutes
- Target Audience: ${targetAudience}
- Scripture Reference: ${scriptureReference}
- Concept: ${concept}

DO NOT make up or change any of these parameters. Use them exactly as provided.

Time allocation:
- Opening and Setting Context (10% of ${duration} minutes)
- Main Teaching Points (60% of ${duration} minutes)
- Practice or Meditation Guidance (20% of ${duration} minutes)
- Closing and Integration (10% of ${duration} minutes)

Your talk should be:
- Clear and accessible to ${targetAudience}
- Focused specifically on ${focus}
- Structured with clear sections
- Include teaching points, examples, and practice guidance
- Respectful of the ${style} tradition
- Appropriate for a ${duration}-minute talk
- Incorporate the concept: ${concept}
- Reference the scripture: ${scriptureReference}

For each section, include:
- Clear teaching points about ${focus}
- Specific examples or stories related to ${concept}
- Practical applications for ${targetAudience}
- Relevant quotes from ${scriptureReference} where appropriate

# User Prompt
Create a dharma talk using EXACTLY the following parameters. Do not change or make up any parameters.

TITLE: Dharma Talk - ${focus}

OVERVIEW:
${concept}

DETAILS:
- Style: ${style}
- Duration: ${duration} minutes
- Target Audience: ${targetAudience}
- Scripture Reference: ${scriptureReference}

TALK STRUCTURE:
Please generate the talk content with the following sections:

1. OPENING AND SETTING CONTEXT (about ${Math.round(parseInt(duration) * 0.1)} minutes)
   - Include an introduction to the topic of ${focus}
   - Set the context for ${targetAudience} audience
   - Introduce key concepts related to ${concept}

2. MAIN TEACHING POINTS (about ${Math.round(parseInt(duration) * 0.6)} minutes)
   - Present 2-3 main teaching points about ${focus}
   - For each point include:
     * Key message related to ${focus}
     * Example or story that illustrates ${concept}
     * Connection to ${scriptureReference}

3. PRACTICE OR MEDITATION GUIDANCE (about ${Math.round(parseInt(duration) * 0.2)} minutes)
   - Provide practical guidance appropriate for ${targetAudience}
   - Include specific instructions related to ${focus}
   - Offer reflection questions about ${concept}

4. CLOSING AND INTEGRATION (about ${Math.round(parseInt(duration) * 0.1)} minutes)
   - Summarize key points about ${focus}
   - Connect back to the main concept: ${concept}
   - Offer final thoughts or inspiration in the ${style} tradition

IMPORTANT: Use EXACTLY these parameters:
- Focus: ${focus}
- Style: ${style}
- Duration: ${duration} minutes
- Target Audience: ${targetAudience}
- Scripture Reference: ${scriptureReference}
- Concept: ${concept}
