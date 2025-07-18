// config.ts
export interface EvalConfig {
  defaultTemplate: string;
  templateMappings: {
    [key: string]: string;
  };
}

export const defaultConfig: EvalConfig = {
  defaultTemplate: "default-eval.txt",
  templateMappings: {
    "conventions": "conventions-eval.txt"
  }
};

// Domain Types & Configs
export interface DomainCategory {
  name: string;
  aliases: string[];
  patterns: string[];  // Key terminology/patterns for this category
}

export interface DomainConfig {
  name: string;
  description: string;
  categories: DomainCategory[];
  defaultTemplate: string;
  templateMappings: Record<string, string>;
}

// Example compute domain config
export const computeDomain: DomainConfig = {
  name: "compute",
  description: "Software development and computing conventions",
  categories: [
    {
      name: "SECURITY",
      aliases: ["Security", "**Security**"],
      patterns: ["authentication", "authorization", "encryption", "vulnerabilities", "secure", "safety"]
    },
    {
      name: "ERROR_HANDLING",
      aliases: ["Error Handling", "**Error Handling**"],
      patterns: ["exceptions", "errors", "fault tolerance", "recovery", "failure"]
    },
    {
      name: "API_DESIGN",
      aliases: ["API Design", "**API Design**"],
      patterns: ["endpoints", "interfaces", "REST", "GraphQL", "API"]
    },
    {
      name: "PERFORMANCE",
      aliases: ["Performance", "**Performance**"],
      patterns: ["optimization", "efficiency", "caching", "scalability", "speed"]
    },
    {
      name: "DOCUMENTATION",
      aliases: ["Documentation", "**Documentation**"],
      patterns: ["docs", "specifications", "guides", "examples", "readme"]
    }
  ],
  defaultTemplate: "compute-eval.txt",
  templateMappings: {
    "conventions": "conventions-eval.txt"
  }
};

export const financeDomain: DomainConfig = {
  name: "finance",
  description: "Financial operations and compliance conventions",
  categories: [
    {
      name: "COMPLIANCE",
      aliases: ["Compliance", "Regulatory Compliance"],
      patterns: ["regulations", "requirements", "policies", "governance"]
    },
    {
      name: "RISK_MANAGEMENT",
      aliases: ["Risk Management", "Risk"],
      patterns: ["risk", "mitigation", "assessment", "exposure"]
    },
    {
      name: "REPORTING",
      aliases: ["Financial Reporting", "Reporting"],
      patterns: ["statements", "reports", "disclosures", "filings"]
    },
    {
      name: "CONTROLS",
      aliases: ["Internal Controls", "Controls"],
      patterns: ["controls", "procedures", "oversight", "audit"]
    },
    {
      name: "OPERATIONS",
      aliases: ["Operations", "Financial Operations"],
      patterns: ["processes", "transactions", "reconciliation"]
    }
  ],
  defaultTemplate: "finance-eval.txt",
  templateMappings: {
    "regulatory": "regulatory-eval.txt"
  }
};

export const wellnessDomain: DomainConfig = {
  name: "wellness",
  description: "Health and wellness guidelines",
  categories: [
    {
      name: "SAFETY",
      aliases: ["Safety", "Health Safety"],
      patterns: ["precautions", "protection", "hazards", "emergency"]
    },
    {
      name: "PROTOCOLS",
      aliases: ["Protocols", "Procedures"],
      patterns: ["procedures", "guidelines", "steps", "process"]
    },
    {
      name: "COMPLIANCE",
      aliases: ["Compliance", "Regulations"],
      patterns: ["requirements", "regulations", "standards", "rules"]
    },
    {
      name: "MONITORING",
      aliases: ["Monitoring", "Assessment"],
      patterns: ["tracking", "measurement", "evaluation", "assessment"]
    },
    {
      name: "DOCUMENTATION",
      aliases: ["Documentation", "Records"],
      patterns: ["records", "documentation", "reports", "logs"]
    }
  ],
  defaultTemplate: "wellness-eval.txt",
  templateMappings: {
    "safety": "safety-eval.txt"
  }
};

// Domain Config Registry
export const domainConfigs: Record<string, DomainConfig> = {
  compute: computeDomain,
  finance: financeDomain,
  wellness: wellnessDomain
};

// General Config
export const config = {
  directories: {
    primitives: './data/primitives',
    index: './data/idx',
    prompts: './data/prompts',
    import_dir: "./data/import",
    output_dir: "./data/import",
    templates: "./data/templates",
    import_templates: "./data/templates/import"
  },
};
