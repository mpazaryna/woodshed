// domains/yoga_handler.ts
import { BaseDomainHandler, Primitive, SelectionResult } from "../stacker.ts";

export class YogaDomainHandler extends BaseDomainHandler {
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

  private async displayPracticeDetails(primitive: Primitive) {
    console.log("\nPractice Details:");
    console.log(`Name: ${primitive.name}`);
    console.log(`Description: ${primitive.description}`);
    console.log("Associated Elements:");
    primitive.tags.forEach(tag => console.log(`- ${tag}`));
    
    // Add specific guidance for yoga practices
    if (primitive.tags.includes('pranayama')) {
      console.log("\nImportant Note: Pranayama practices should be approached mindfully.");
      console.log("It's recommended to practice under qualified guidance initially.");
    }
  }

  async getSelectionFlow(): Promise<SelectionResult> {
    console.log("\nWelcome to the Yoga Practice Builder!");
    console.log("This tool will help you select appropriate yoga practices for your needs.");
    console.log("Please note: Always practice within your comfort level and consult with a qualified instructor.");
    
    const categorizedPrimitives = this.getCategorizedPrimitives();
    
    for (const [category, primitives] of categorizedPrimitives) {
      const includeCategoryResponse = await this.promptYesNo(
        `\nWould you like to explore ${category}?`
      );
      
      if (includeCategoryResponse) {
        this.selectedCategories.add(category);
        console.log(`\nExploring ${category}:`);
        
        for (const primitive of primitives) {
          await this.displayPracticeDetails(primitive);
          
          const experienceResponse = await this.promptYesNo(
            "\nDo you have previous experience with this type of practice?"
          );
          
          if (!experienceResponse) {
            console.log("\nNote: Consider starting with basic practices first.");
            console.log("It's recommended to learn these techniques from a qualified instructor.");
          }
          
          const includeResponse = await this.promptYesNo(
            "\nWould you like to include this practice in your sequence?"
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
      console.log("\nNo practices were selected.");
      return false;
    }

    // Validate selections for each chosen category
    for (const category of this.selectedCategories) {
      const categoryPrimitives = this.primitives.filter(p => 
        this.cleanCategoryName(p.category) === category
      );
      
      const hasSelectedFromCategory = categoryPrimitives.some(p => 
        this.selectedPrimitives.has(p.path)
      );
      
      if (!hasSelectedFromCategory) {
        console.log(`\nNote: No practices selected from ${category}.`);
        const proceed = await this.promptYesNo(
          "Would you like to proceed with your current selection?"
        );
        if (!proceed) return false;
      }
    }

    return true;
  }

  async generateOutput(selections: string[]): Promise<string> {
    const baseOutput = await super.generateOutput(selections);
    
    console.log("\nYoga Practice Sequence Summary:");
    console.log("Selected Categories:");
    for (const category of this.selectedCategories) {
      const categoryPrimitives = this.primitives.filter(p => 
        this.cleanCategoryName(p.category) === category &&
        this.selectedPrimitives.has(p.path)
      );
      
      console.log(`\n${category}:`);
      categoryPrimitives.forEach(p => {
        console.log(`- ${p.name}`);
        console.log(`  ${p.description}`);
      });
    }

    console.log("\nRemember:");
    console.log("- Practice mindfully and within your comfort level");
    console.log("- Maintain steady, comfortable breathing throughout");
    console.log("- Seek guidance from a qualified instructor when needed");

    return baseOutput;
  }
}