export const react_redux_typescriptRules = [{
    title: "react-redux-typescript",
    tags: [],
    slug: "react-redux-typescript",
    libs: [],
    content: `// React + Redux + TypeScript .cursorrules

// Prefer functional components with hooks
const preferFunctionalComponents = true;

// Use TypeScript for type safety
const useTypeScript = true;

// Redux best practices
const reduxBestPractices = [
  "Use Redux Toolkit for efficient Redux development",
  "Implement slice pattern for organizing Redux code",
  "Utilize createAsyncThunk for handling async actions",
  "Use selectors for accessing state in components",
];

// Folder structure
const folderStructure = \`
src/
  components/
  features/
  store/
    slices/
    hooks.ts
    store.ts
  types/
  utils/
\`;

// Additional instructions
const additionalInstructions = \`
1. Use React.FC for functional components with props
2. Implement strict TypeScript checks
3. Use Redux hooks (useSelector, useDispatch) in components
4. Create reusable typed hooks for Redux operations
5. Implement proper error handling in async operations
6. Use Redux DevTools for debugging
7. Follow Redux style guide for naming conventions
\`;
`,
    author: {
      name: "System",
      url: "",
      avatar: "",
      email: ""
    }
  }];