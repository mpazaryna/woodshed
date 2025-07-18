export class XMLGenerator {
  static generateStackXML(matchedPrimitives: Primitive[], aiResponse: AIResponse): string {
    const { reasoning, detectedLanguage } = aiResponse;
    
    // Compose complete tag set from all matched primitives with logging
    const composedTags = new Set<string>();
    console.log('\nComposing tags from matched primitives:');
    
    matchedPrimitives.forEach(primitive => {
      console.log(`\nPrimitive: ${primitive.name}`);
      console.log('Contributing tags:');
      primitive.tags.forEach(tag => {
        console.log(`  - ${tag}`);
        composedTags.add(tag);
      });
    });

    console.log('\nFinal composed tag set:');
    Array.from(composedTags).sort().forEach(tag => {
      console.log(`  - ${tag}`);
    });

    // Organize primitives by category for better structure
    const primitivesByCategory = new Map<string, Primitive[]>();
    matchedPrimitives.forEach(primitive => {
      if (!primitivesByCategory.has(primitive.category)) {
        primitivesByCategory.set(primitive.category, []);
      }
      primitivesByCategory.get(primitive.category)?.push(primitive);
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<template name="context-rules">
  <contextRules>
    <meta>
      <category>Project Configuration</category>
      <detectedLanguage>${detectedLanguage || 'Not specified'}</detectedLanguage>
      <tags>
        ${Array.from(composedTags).sort().map(tag => `<tag>${tag}</tag>`).join('\n        ')}
      </tags>
      <aiReasoning>${reasoning}</aiReasoning>
    </meta>
    ${this.generateAllPrimitives(primitivesByCategory)}
  </contextRules>
</template>`;
  }

  private static generateAllPrimitives(primitivesByCategory: Map<string, Primitive[]>): string {
    console.log('\nGenerating XML sections for all primitives by category:');
    
    const sections: string[] = [];
    
    // Process each category
    for (const [category, primitives] of primitivesByCategory) {
      console.log(`\nProcessing category: ${category}`);
      const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
      
      const primitivesXml = primitives.map(p => {
        console.log(`  Processing primitive: ${p.name}`);
        // Convert primitive name to a readable format
        const name = p.name.replace(/^clean-code-/, '').toUpperCase();
        
        return `
      <${categorySlug} name="${name}">
        <description>${p.description}</description>
        <implementation>Implement according to ${category} principles</implementation>
        <tags>
          ${p.tags.map(tag => `<tag>${tag}</tag>`).join('\n          ')}
        </tags>
      </${categorySlug}>`;
      }).join('\n');
      
      sections.push(`    <${categorySlug}-section>${primitivesXml}
    </${categorySlug}-section>`);
    }

    return sections.join('\n');
  }
} 