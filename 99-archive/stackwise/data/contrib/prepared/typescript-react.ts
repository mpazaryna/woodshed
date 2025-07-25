export const typescript_reactRules = [{
    title: "typescript-react",
    tags: [],
    slug: "typescript-react",
    libs: [],
    content: `// TypeScript React .cursorrules

// Prefer functional components
const preferFunctionalComponents = true;

// TypeScript React best practices
const typescriptReactBestPractices = [
  "Use React.FC for functional components with props",
  "Utilize useState and useEffect hooks for state and side effects",
  "Implement proper TypeScript interfaces for props and state",
  "Use React.memo for performance optimization when needed",
  "Implement custom hooks for reusable logic",
  "Utilize TypeScript's strict mode",
];

// Folder structure
const folderStructure = \`
src/
  components/
  hooks/
  pages/
  types/
  utils/
  App.tsx
  index.tsx
\`;

// Additional instructions
const additionalInstructions = \`
1. Use .tsx extension for files with JSX
2. Implement strict TypeScript checks
3. Utilize React.lazy and Suspense for code-splitting
4. Use type inference where possible
5. Implement error boundaries for robust error handling
6. Follow React and TypeScript best practices and naming conventions
7. Use ESLint with TypeScript and React plugins for code quality
\`;
`,
    author: {
      name: "System",
      url: "",
      avatar: "",
      email: ""
    }
  }];