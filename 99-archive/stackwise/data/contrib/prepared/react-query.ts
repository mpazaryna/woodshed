export const react_queryRules = [{
    title: "react-query",
    tags: [],
    slug: "react-query",
    libs: [],
    content: `// React + React Query .cursorrules

// Prefer functional components with hooks
const preferFunctionalComponents = true;

// React Query best practices
const reactQueryBestPractices = [
  "Use QueryClient and QueryClientProvider at the root of your app",
  "Implement custom hooks for queries and mutations",
  "Utilize query keys for effective caching",
  "Use prefetching for improved performance",
  "Implement proper error and loading states",
];

// Folder structure
const folderStructure = \`
src/
  components/
  hooks/
    useQueries/
    useMutations/
  pages/
  utils/
  api/
\`;

// Additional instructions
const additionalInstructions = \`
1. Use TypeScript for type safety with React Query
2. Implement proper error boundaries for query errors
3. Utilize React Query DevTools for debugging
4. Use stale-while-revalidate strategy for data freshness
5. Implement optimistic updates for mutations
6. Use query invalidation for data refetching
7. Follow React Query naming conventions for consistency
\`;
`,
    author: {
      name: "System",
      url: "",
      avatar: "",
      email: ""
    }
  }];