import { BaseDomainHandler, Primitive, SelectionResult } from "../stacker.ts";

const STORY_TYPES = ['aristotelian', 'hero', 'harmon-circle'] as const;

export class StoryDomainHandler extends BaseDomainHandler {
  private selectedStoryTypes: Set<string> = new Set();
  private selectedPhases: Set<string> = new Set();

  override cleanCategoryName(category: string): string {
    return category.replace('.md', '').trim();
  }

  override getCategorizedPrimitives(): Map<string, Primitive[]> {
    const categorized = new Map<string, Primitive[]>();
    
    this.primitives.forEach(primitive => {
      const storyType = primitive.tags.find(tag => STORY_TYPES.includes(tag as any));
      if (storyType) {
        if (!categorized.has(storyType)) {
          categorized.set(storyType, []);
        }
        categorized.get(storyType)!.push(primitive);
      }
    });

    return categorized;
  }

  override async getSelectionFlow(): Promise<SelectionResult> {
    console.log("\nWelcome to the Story Stack Builder!");
    
    const categorizedPrimitives = this.getCategorizedPrimitives();
    
    for (const [storyType, primitives] of categorizedPrimitives) {
      const includeStoryTypeResponse = await this.promptYesNo(
        `\nWould you like to explore ${storyType} story structure?`
      );
      
      if (includeStoryTypeResponse) {
        this.selectedStoryTypes.add(storyType);
        console.log(`\nLet's configure ${storyType} story elements:`);
        
        // Group primitives by their component type (base, format, structure, etc)
        const componentGroups = new Map<string, Primitive[]>();
        primitives.forEach(primitive => {
          const componentType = primitive.tags.find(tag => 
            ['base', 'format', 'structure', 'creative', 'requirements', 'improvements', 'advanced'].includes(tag)
          );
          if (componentType) {
            if (!componentGroups.has(componentType)) {
              componentGroups.set(componentType, []);
            }
            componentGroups.get(componentType)!.push(primitive);
          }
        });

        // Present components in a logical order
        const componentOrder = ['base', 'structure', 'format', 'requirements', 'creative', 'improvements', 'advanced'];
        for (const componentType of componentOrder) {
          const components = componentGroups.get(componentType) || [];
          for (const primitive of components) {
            const includeResponse = await this.promptYesNo(
              `\nInclude ${primitive.name}?\n${primitive.description}\n` +
              `Component type: ${componentType}`
            );
            
            if (includeResponse) {
              this.selectedPrimitives.add(primitive.path);
            }
          }
        }
      }
    }

    return {
      selectedPrimitives: this.selectedPrimitives,
      context: {
        storyTypes: Array.from(this.selectedStoryTypes)
      }
    };
  }

  override async validateSelections(): Promise<boolean> {
    if (this.selectedPrimitives.size === 0) {
      console.log("\nWarning: No story components were selected.");
      return false;
    }

    for (const storyType of this.selectedStoryTypes) {
      const storyTypePrimitives = this.primitives.filter(p => 
        p.tags.includes(storyType)
      );
      
      const hasSelectedFromType = storyTypePrimitives.some(p => 
        this.selectedPrimitives.has(p.path)
      );
      
      if (!hasSelectedFromType) {
        console.log(`\nWarning: No components selected from ${storyType} story type.`);
        const proceed = await this.promptYesNo(
          "Would you like to proceed anyway?"
        );
        if (!proceed) return false;
      }

      // Check if essential components (base and structure) are selected
      const hasBase = storyTypePrimitives.some(p => 
        p.tags.includes('base') && this.selectedPrimitives.has(p.path)
      );
      const hasStructure = storyTypePrimitives.some(p => 
        p.tags.includes('structure') && this.selectedPrimitives.has(p.path)
      );

      if (!hasBase || !hasStructure) {
        console.log(`\nWarning: Missing essential components (base or structure) for ${storyType} story type.`);
        const proceed = await this.promptYesNo(
          "Would you like to proceed without these essential components?"
        );
        if (!proceed) return false;
      }
    }

    return true;
  }

  override async generateOutput(selections: string[]): Promise<string> {
    const baseOutput = await super.generateOutput(selections);
    
    console.log("\nStory Stack Summary:");
    console.log("Selected Story Types:");
    for (const storyType of this.selectedStoryTypes) {
      const storyTypePrimitives = this.primitives.filter(p => 
        p.tags.includes(storyType) && this.selectedPrimitives.has(p.path)
      );
      
      console.log(`\n${storyType}:`);
      
      // Group by component type for organized display
      const componentTypes = ['base', 'structure', 'format', 'requirements', 'creative', 'improvements', 'advanced'];
      for (const componentType of componentTypes) {
        const components = storyTypePrimitives.filter(p => p.tags.includes(componentType));
        if (components.length > 0) {
          console.log(`\n  ${componentType}:`);
          components.forEach(p => {
            console.log(`  - ${p.name}: ${p.description}`);
          });
        }
      }
    }

    return baseOutput;
  }
} 