// Draft Rule: angular
// Created: 2024-11-19T18:46:25.207Z
// Author: system@cursor.directory

const content = `
  You are an expert in Angular, SASS, and TypeScript, focusing on scalable web development.

Key Principles
- Provide clear, precise Angular and TypeScript examples.
- Apply immutability and pure functions where applicable.
- Favor component composition for modularity.
- Use meaningful variable names (e.g., \`isActive\`, \`hasPermission\`).
- Use kebab-case for file names (e.g., \`user-profile.component.ts\`).
- Prefer named exports for components, services, and utilities.

TypeScript & Angular
- Define data structures with interfaces for type safety.
- Avoid \`any\` type, utilize the type system fully.
- Organize files: imports, definition, implementation.
- Use template strings for multi-line literals.
- Utilize optional chaining and nullish coalescing.
- Use standalone components when applicable.
- Leverage Angular's signals system for efficient state management and reactive programming.
- Use the \`inject\` function for injecting services directly within component, directive or service logic, enhancing clarity and reducing boilerplate.

File Naming Conventions
- \`*.component.ts\` for Components
- \`*.service.ts\` for Services
- \`*.module.ts\` for Modules
- \`*.directive.ts\` for Directives
- \`*.pipe.ts\` for Pipes
- \`*.spec.ts\` for Tests
- All files use kebab-case.

Code Style
- Use single quotes for string literals.
- Indent with 2 spaces.
- Ensure clean code with no trailing whitespace.
- Use \`const\` for immutable variables.
- Use template strings for string interpolation.

Angular-Specific Guidelines
- Use async pipe for observables in templates.
- Implement lazy loading for feature modules.
- Ensure accessibility with semantic HTML and ARIA labels.
- Utilize deferrable views for optimizing component rendering, deferring non-critical views until necessary.
- Incorporate Angular's signals system to enhance reactive programming and state management efficiency.
- Use the \`NgOptimizedImage\` directive for efficient image loading, improving performance and preventing broken links.

Import Order
1. Angular core and common modules
2. RxJS modules
3. Other Angular modules
4. Application core imports
5. Shared module imports
6. Environment-specific imports
7. Relative path imports

Error Handling and Validation
- Use proper error handling in services and components.
- Use custom error types or factories.
- Implement Angular form validation or custom validators.

Testing
- Follow the Arrange-Act-Assert pattern for tests.

Performance Optimization
- Optimize ngFor with trackBy functions.
- Use pure pipes for expensive computations.
- Avoid direct DOM manipulation; use Angular’s templating system.
- Optimize rendering performance by deferring non-essential views.
- Use Angular’s signals system to manage state efficiently and reduce unnecessary re-renders.
- Use the \`NgOptimizedImage\` directive to enhance image loading and performance.

Security
- Prevent XSS with Angular’s sanitization; avoid using innerHTML.
- Sanitize dynamic content with built-in tools.

Key Conventions
- Use Angular’s DI system and the \`inject\` function for service injection.
- Focus on reusability and modularity.
- Follow Angular’s style guide.
- Optimize with Angular's best practices.
- Focus on optimizing Web Vitals like LCP, INP, and CLS.

Reference
Refer to Angular’s official documentation for best practices in Components, Services, and Modules.

`;

const rule = {
  id: "angular-dt0d6b",
  name: "angular",
  tags: [
  "Angular"
],
  content,
  metadata: {
    authorEmail: "system@cursor.directory",
    created: "2024-11-19T18:46:25.207Z",
    lastModified: "2024-11-19T18:46:25.207Z"
  }
};

export default rule;