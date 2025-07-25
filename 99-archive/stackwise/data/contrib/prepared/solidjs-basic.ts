export const solidjs_basicRules = [{
    title: "solidjs-basic",
    tags: [],
    slug: "solidjs-basic",
    libs: [],
    content: `// Solid.js Basic Setup .cursorrules

// Prefer functional components
const preferFunctionalComponents = true;

// Solid.js best practices
const solidjsBestPractices = [
  "Use createSignal() for reactive state",
  "Utilize createEffect() for side effects",
  "Implement createMemo() for derived values",
  "Use createResource() for data fetching",
  "Implement Show and For components for conditional and list rendering",
  "Utilize createStore() for complex state management",
];

// Folder structure
const folderStructure = \`
src/
  components/
  pages/
  utils/
  App.jsx
  index.jsx
public/
  index.html
\`;

// Additional instructions
const additionalInstructions = \`
1. Use JSX for component templates
2. Implement proper error boundaries
3. Utilize Solid Router for routing when applicable
4. Use Solid's built-in optimization features
5. Implement lazy-loading for improved performance
6. Follow Solid.js naming conventions and best practices
7. Use server-side rendering (SSR) when needed
\`;
`,
    author: {
      name: "System",
      url: "",
      avatar: "",
      email: ""
    }
  }];