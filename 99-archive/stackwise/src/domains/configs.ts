// Types
export interface Category {
  name: string;
  description: string;
  weight?: number;
}

export interface DomainConfig {
  name: string;
  description: string;
  categories: Category[];
  templateMappings: Record<string, string>;
  defaultTemplate: string;
}

// Domain Configurations
const computeDomain: Record<string, DomainConfig> = {
  compute: {
    name: "compute",
    description: "Computing conventions and implementations",
    categories: [
      {
        name: "Security",
        description: "Security practices and implementations",
        weight: 1
      },
      {
        name: "Error_Handling",
        description: "Error management and recovery procedures",
        weight: 1
      },
      {
        name: "API_Design",
        description: "API architecture and design patterns",
        weight: 1
      },
      {
        name: "Performance",
        description: "Performance optimization and scaling",
        weight: 1
      },
      {
        name: "Documentation",
        description: "Documentation and maintenance guides",
        weight: 1
      }
    ],
    templateMappings: {
      "principle": "principle.txt",
      "principle-named-exports": "principle.txt",
      "principle-pure-functions": "principle.txt",
      "principle-iteration-and-modularization": "principle.txt",
      "principle-file-naming": "principle.txt",
      "fastapi": "fastapi.txt",
      "performance-optimization": "performance-optimization.txt"
    },
    defaultTemplate: "default.txt"
  }
}; 

// Domain Config Registry
export const domainConfigs: Record<string, DomainConfig> = {
  compute: computeDomain
};