// domains/compute_handler.ts
import { BaseDomainHandler, Language, Primitive, SelectionResult } from "../stacker.ts";

export class ComputeDomainHandler extends BaseDomainHandler {
  private selectedLanguage: Language | null = null;

  private isPrimitiveApplicable(primitive: Primitive): boolean {
    if (!this.selectedLanguage) return false;

    const hasLanguageSpecificTag = primitive.tags.some(tag => tag.endsWith('-specific'));
    
    if (hasLanguageSpecificTag) {
      return primitive.tags.includes(`${this.selectedLanguage.name}-specific`);
    } else {
      return !primitive.tags.some(tag => 
        tag.endsWith('-specific') && !tag.startsWith(this.selectedLanguage.name)
      );
    }
  }

  private getPrimitivesByCategory(category: string): Primitive[] {
    return this.primitives.filter(p => 
      p.category === category && this.isPrimitiveApplicable(p)
    );
  }

  private getApplicableCategories(): string[] {
    return [...new Set(
      this.primitives
        .filter(p => this.isPrimitiveApplicable(p))
        .map(p => p.category)
    )];
  }

  async getSelectionFlow(): Promise<SelectionResult> {
    const languages = this.config.contextTypes.languages || [];
    if (languages.length > 0) {
      const languageOptions = languages.map(l => l.name);
      const selectedLanguageIndex = await this.promptMultiChoice(
        languageOptions,
        "Which primary language are you using?"
      );
      this.selectedLanguage = languages[selectedLanguageIndex];
      
      console.log(`\nConfiguring ${this.selectedLanguage.name} development stack...`);
    }

    const categories = this.getApplicableCategories();
    for (const category of categories) {
      const categoryPrimitives = this.getPrimitivesByCategory(category);
      if (categoryPrimitives.length > 0) {
        console.log(`\nLet's configure ${category}:`);
        
        for (const primitive of categoryPrimitives) {
          const include = await this.promptYesNo(
            `\nInclude ${primitive.name}?\n${primitive.description}`
          );
          if (include) {
            this.selectedPrimitives.add(primitive.path);
          }
        }
      }
    }

    return {
      selectedPrimitives: this.selectedPrimitives,
      context: {
        language: this.selectedLanguage?.name,
        categories: categories
      }
    };
  }
}