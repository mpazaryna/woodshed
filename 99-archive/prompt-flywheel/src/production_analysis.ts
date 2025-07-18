// production_analysis.ts
import { join } from "https://deno.land/std@0.219.0/path/mod.ts";
import { LLMServiceFactory } from "./services/llm_service.ts";

interface ProductionMetrics {
  basic_metrics: {
    total_characters: number;
    lead_characters: number;
    supporting_characters: number;
    background_characters: number;
    estimated_runtime_minutes: number;
    act_count: number;
    scene_count: number;
    location_count: { interior: number; exterior: number; };
  };
  production_complexity: {
    special_effects_scenes: number;
    costume_changes: number;
    makeup_complexity: number;
    prop_complexity: number;
    stunt_scenes: number;
    animal_scenes: number;
    night_scenes: number;
    crowd_scenes: number;
  };
  location_types: string[];
  technical_requirements: {
    weather_dependent_scenes: number;
    underwater_scenes: number;
    aerial_shots: number;
    vehicle_scenes: number;
    period_specific_elements: boolean;
    greenscreen_requirements: number;
  };
  scheduling_factors: {
    seasonal_requirements: string;
    estimated_shooting_days: number;
    location_accessibility_challenge: number;
    weather_dependency_risk: number;
    talent_scheduling_complexity: number;
  };
  budget_impact_factors: {
    location_costs: number;
    effects_costs: number;
    costume_costs: number;
    prop_costs: number;
    talent_costs: number;
    overall_budget_tier: string;
  };
}

async function loadPrompt(): Promise<string> {
  const promptPath = join('prompts', 'story-analyzer', 'prompt.txt');
  return await Deno.readTextFile(promptPath);
}

async function analyzeContent(content: string): Promise<ProductionMetrics> {
  const llmService = LLMServiceFactory.create("claude");
  
  const basePrompt = await loadPrompt();
  const fullPrompt = `${basePrompt}\n\nStory to analyze:\n${content}\n\nProvide the analysis as JSON only, without any additional commentary.`;

  const response = await llmService.generateContent(fullPrompt);
  
  try {
    // Look for JSON within code blocks first
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      // Clean the extracted JSON string
      const jsonStr = jsonMatch[1].trim();
      return JSON.parse(jsonStr) as ProductionMetrics;
    }
    
    // If no code blocks found, try parsing the entire response
    try {
      return JSON.parse(response) as ProductionMetrics;
    } catch {
      throw new Error("Response did not contain valid JSON");
    }
  } catch (e) {
    console.error("Raw response:", response);
    throw new Error(`Failed to parse metrics JSON: ${e.message}`);
  }
}

function generateMarkdownReport(metrics: ProductionMetrics): string {
  return `# Production Analysis Report

## Basic Metrics
- Total Characters: ${metrics.basic_metrics.total_characters}
- Lead Characters: ${metrics.basic_metrics.lead_characters}
- Supporting Characters: ${metrics.basic_metrics.supporting_characters}
- Background Characters: ${metrics.basic_metrics.background_characters}
- Estimated Runtime: ${metrics.basic_metrics.estimated_runtime_minutes} minutes
- Act Count: ${metrics.basic_metrics.act_count}
- Scene Count: ${metrics.basic_metrics.scene_count}
- Locations: ${metrics.basic_metrics.location_count.interior} interior, ${metrics.basic_metrics.location_count.exterior} exterior

## Production Complexity
- Special Effects Scenes: ${metrics.production_complexity.special_effects_scenes}
- Costume Changes: ${metrics.production_complexity.costume_changes}
- Makeup Complexity (1-5): ${metrics.production_complexity.makeup_complexity}
- Prop Complexity (1-5): ${metrics.production_complexity.prop_complexity}
- Stunt Scenes: ${metrics.production_complexity.stunt_scenes}
- Animal Scenes: ${metrics.production_complexity.animal_scenes}
- Night Scenes: ${metrics.production_complexity.night_scenes}
- Crowd Scenes: ${metrics.production_complexity.crowd_scenes}

## Location Types
${metrics.location_types.map(loc => `- ${loc}`).join('\n')}

## Technical Requirements
- Weather Dependent Scenes: ${metrics.technical_requirements.weather_dependent_scenes}
- Underwater Scenes: ${metrics.technical_requirements.underwater_scenes}
- Aerial Shots: ${metrics.technical_requirements.aerial_shots}
- Vehicle Scenes: ${metrics.technical_requirements.vehicle_scenes}
- Period Specific Elements: ${metrics.technical_requirements.period_specific_elements}
- Greenscreen Requirements (1-5): ${metrics.technical_requirements.greenscreen_requirements}

## Scheduling Factors
- Seasonal Requirements: ${metrics.scheduling_factors.seasonal_requirements}
- Estimated Shooting Days: ${metrics.scheduling_factors.estimated_shooting_days}
- Location Accessibility Challenge (1-5): ${metrics.scheduling_factors.location_accessibility_challenge}
- Weather Dependency Risk (1-5): ${metrics.scheduling_factors.weather_dependency_risk}
- Talent Scheduling Complexity (1-5): ${metrics.scheduling_factors.talent_scheduling_complexity}

## Budget Impact Factors
- Location Costs (1-5): ${metrics.budget_impact_factors.location_costs}
- Effects Costs (1-5): ${metrics.budget_impact_factors.effects_costs}
- Costume Costs (1-5): ${metrics.budget_impact_factors.costume_costs}
- Prop Costs (1-5): ${metrics.budget_impact_factors.prop_costs}
- Talent Costs (1-5): ${metrics.budget_impact_factors.talent_costs}
- Overall Budget Tier: ${metrics.budget_impact_factors.overall_budget_tier}`;
}

async function main() {
  const [outputDir] = Deno.args;
  if (!outputDir) {
    console.error("Please provide an output directory");
    Deno.exit(1);
  }

  const inputPath = join('output', outputDir, 'created.md');
  const outputPath = join('output', outputDir, 'production_analysis.md');

  try {
    console.log(`Reading content from: ${inputPath}`);
    const content = await Deno.readTextFile(inputPath);

    console.log('Analyzing content...');
    const metrics = await analyzeContent(content);

    console.log(`Writing analysis to: ${outputPath}`);
    const report = generateMarkdownReport(metrics);
    await Deno.writeTextFile(outputPath, report);

    console.log('Analysis complete');
  } catch (error) {
    console.error('Error:', error.message);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}