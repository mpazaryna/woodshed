// domains/art_handler.ts
import { BaseDomainHandler, Primitive, SelectionResult } from "../stacker.ts";

export class ArtDomainHandler extends BaseDomainHandler {
  private selectedCategories: Set<string> = new Set();

  private cleanCategoryName(category: string): string {
    return category.replace('.xml', '').trim();
  }

  private getCategorizedPrimitives(): Map<string, Primitive[]> {
    const categorized = new Map<string, Primitive[]>();
    
    this.primitives.forEach(primitive => {
      const category = this.cleanCategoryName(primitive.category);
      if (!categorized.has(category)) {
        categorized.set(category, []);
      }
      categorized.get(category)!.push(primitive);
    });

    return categorized;
  }

  async getSelectionFlow(): Promise<SelectionResult> {
    console.log("\nWelcome to the Art Stack Builder!");
    
    const categorizedPrimitives = this.getCategorizedPrimitives();
    
    for (const [category, primitives] of categorizedPrimitives) {
      const includeCategoryResponse = await this.promptYesNo(
        `\nWould you like to explore ${category} techniques?`
      );
      
      if (includeCategoryResponse) {
        this.selectedCategories.add(category);
        console.log(`\nLet's configure ${category}:`);
        
        for (const primitive of primitives) {
          const includeResponse = await this.promptYesNo(
            `\nInclude ${primitive.name}?\n${primitive.description}\n` +
            `Related concepts: ${primitive.tags.join(', ')}`
          );
          
          if (includeResponse) {
            this.selectedPrimitives.add(primitive.path);
          }
        }
      }
    }

    return {
      selectedPrimitives: this.selectedPrimitives,
      context: {
        categories: Array.from(this.selectedCategories)
      }
    };
  }

  async validateSelections(): Promise<boolean> {
    if (this.selectedPrimitives.size === 0) {
      console.log("\nWarning: No techniques were selected.");
      return false;
    }

    for (const category of this.selectedCategories) {
      const categoryPrimitives = this.primitives.filter(p => 
        this.cleanCategoryName(p.category) === category
      );
      
      const hasSelectedFromCategory = categoryPrimitives.some(p => 
        this.selectedPrimitives.has(p.path)
      );
      
      if (!hasSelectedFromCategory) {
        console.log(`\nWarning: No techniques selected from ${category}.`);
        const proceed = await this.promptYesNo(
          "Would you like to proceed anyway?"
        );
        if (!proceed) return false;
      }
    }

    return true;
  }

  async generateOutput(selections: string[]): Promise<string> {
    const baseOutput = await super.generateOutput(selections);
    
    console.log("\nArt Stack Summary:");
    console.log("Selected Categories:");
    for (const category of this.selectedCategories) {
      const categoryPrimitives = this.primitives.filter(p => 
        this.cleanCategoryName(p.category) === category &&
        this.selectedPrimitives.has(p.path)
      );
      
      console.log(`\n${category}:`);
      categoryPrimitives.forEach(p => {
        console.log(`- ${p.name}: ${p.description}`);
      });
    }

    return baseOutput;
  }
}