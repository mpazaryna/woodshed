export const solidjs_typescriptRules = [{
    title: "solidjs-typescript",
    tags: [],
    slug: "solidjs-typescript",
    libs: [],
    content: `// Solid.js with TypeScript .cursorrules

// Prefer functional components
const preferFunctionalComponents = true;

// Solid.js and TypeScript best practices
const solidjsTypeScriptBestPractices = [
  "Use createSignal<T>() for typed reactive state",
  "Implement proper type definitions for components",
  "Utilize TypeScript's strict mode",
  "Use type inference where possible",
  "Implement interfaces for complex prop types",
  "Utilize utility types provided by Solid.js",
];

// Folder structure
const folderStructure = \`
src/
  components/
  pages/
  utils/
  types/
  App.tsx
  index.tsx
public/
  index.html
tsconfig.json
\`;

// Additional instructions
const additionalInstructions = \`
1. Use .tsx extension for files with JSX
2. Implement strict TypeScript checks
3. Utilize Solid Router with proper typing
4. Use type-safe context with createContext
5. Implement proper typing for event handlers
6. Follow TypeScript best practices and naming conventions
7. Use type assertions sparingly and only when necessary
\`;
`,
    author: {
      name: "System",
      url: "",
      avatar: "",
      email: ""
    }
  }];