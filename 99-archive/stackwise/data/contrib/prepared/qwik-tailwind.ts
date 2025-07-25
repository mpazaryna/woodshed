export const qwik_tailwindRules = [{
    title: "qwik-tailwind",
    tags: [],
    slug: "qwik-tailwind",
    libs: [],
    content: `// Qwik.js with Tailwind CSS (TypeScript and Vite included) .cursorrules

// Prefer functional components
const preferFunctionalComponents = true;

// Qwik.js and Tailwind CSS best practices
const qwikTailwindBestPractices = [
  "Use $ suffix for lazy-loaded functions",
  "Utilize useSignal() for reactive state",
  "Implement Tailwind CSS classes for styling",
  "Use @apply directive in CSS files for reusable styles",
  "Implement responsive design using Tailwind's responsive classes",
  "Utilize Tailwind's configuration file for customization",
  "Leverage TypeScript for type safety",
  "Use Vite's fast HMR for development",
];

// Folder structure
const folderStructure = \`
src/
  components/
  routes/
  global.css
  root.tsx
  entry.ssr.tsx
public/
tailwind.config.js
postcss.config.js
vite.config.ts
tsconfig.json
\`;

// Additional instructions
const additionalInstructions = \`
1. Use TypeScript for all .ts and .tsx files
2. Implement proper Tailwind CSS purging for production builds
3. Utilize Qwik City for routing when applicable
4. Use Tailwind's @layer directive for custom styles
5. Implement dark mode using Tailwind's dark variant
6. Follow both Qwik and Tailwind naming conventions
7. Use server$ for server-side code execution
8. Leverage Vite plugins for optimized builds
\`;
`,
    author: {
      name: "System",
      url: "",
      avatar: "",
      email: ""
    }
  }];