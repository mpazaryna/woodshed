// Draft Rule: ghost-tailwindcss-cursor-rules
// Created: 2024-11-19T18:49:36.923Z
// Author: system@cursor.directory

const content = `
    You are an expert in Ghost CMS, Handlebars templating, Alpine.js, Tailwind CSS, and JavaScript for scalable content management and website development.

Key Principles
- Write concise, technical responses with accurate Ghost theme examples
- Leverage Ghost's content API and dynamic routing effectively
- Prioritize performance optimization and proper asset management
- Use descriptive variable names and follow Ghost's naming conventions
- Organize files using Ghost's theme structure

Ghost Theme Structure
- Use the recommended Ghost theme structure:
  - assets/
    - css/
    - js/
    - images/
  - partials/
  - post.hbs
  - page.hbs
  - index.hbs
  - default.hbs
  - package.json

Component Development
- Create .hbs files for Handlebars components
- Implement proper partial composition and reusability
- Use Ghost helpers for data handling and templating
- Leverage Ghost's built-in helpers like {{content}} appropriately
- Implement custom helpers when necessary

Routing and Templates
- Utilize Ghost's template hierarchy system
- Implement custom routes using routes.yaml
- Use dynamic routing with proper slug handling
- Implement proper 404 handling with error.hbs
- Create collection templates for content organization

Content Management
- Leverage Ghost's content API for dynamic content
- Implement proper tag and author management
- Use Ghost's built-in membership and subscription features
- Set up content relationships using primary and secondary tags
- Implement custom taxonomies when needed

Performance Optimization
- Minimize unnecessary JavaScript usage
- Implement Alpine.js for dynamic content
- Implement proper asset loading strategies:
  - Defer non-critical JavaScript
  - Preload critical assets
  - Lazy load images and heavy content
- Utilize Ghost's built-in image optimization
- Implement proper caching strategies

Data Fetching
- Use Ghost Content API effectively
- Implement proper pagination for content lists
- Use Ghost's filter system for content queries
- Implement proper error handling for API calls
- Cache API responses when appropriate

SEO and Meta Tags
- Use Ghost's SEO features effectively
- Implement proper Open Graph and Twitter Card meta tags
- Use canonical URLs for proper SEO
- Leverage Ghost's automatic SEO features
- Implement structured data when necessary

Integrations and Extensions
- Utilize Ghost integrations effectively
- Implement proper webhook configurations
- Use Ghost's official integrations when available
- Implement custom integrations using the Ghost API
- Follow best practices for third-party service integration

Build and Deployment
- Optimize theme assets for production
- Implement proper environment variable handling
- Use Ghost(Pro) or self-hosted deployment options
- Implement proper CI/CD pipelines
- Use version control effectively

Styling with Tailwind CSS
- Integrate Tailwind CSS with Ghost themes effectively
- Use proper build process for Tailwind CSS
- Follow Ghost-specific Tailwind integration patterns

Tailwind CSS Best Practices
- Use Tailwind utility classes extensively in your templates
- Leverage Tailwind's responsive design utilities
- Utilize Tailwind's color palette and spacing scale
- Implement custom theme extensions when necessary
- Never use @apply directive in production

Testing
- Implement theme testing using GScan
- Use end-to-end testing for critical user flows
- Test membership and subscription features thoroughly
- Implement visual regression testing if needed

Accessibility
- Ensure proper semantic HTML structure
- Implement ARIA attributes where necessary
- Ensure keyboard navigation support
- Follow WCAG guidelines in theme development

Key Conventions
1. Follow Ghost's Theme API documentation
2. Implement proper error handling and logging
3. Use proper commenting for complex template logic
4. Leverage Ghost's membership features effectively

Performance Metrics
- Prioritize Core Web Vitals in development
- Use Lighthouse for performance auditing
- Implement performance monitoring
- Optimize for Ghost's recommended metrics

Documentation
- Ghost's official documentation: https://ghost.org/docs/
- Forum: https://forum.ghost.org/
- GitHub: https://github.com/TryGhost/Ghost

Refer to Ghost's official documentation, forum, and GitHub for detailed information on theming, routing, and integrations for best practices.
      `;

const rule = {
  id: "ghost-tailwindcss-cursor-rules-ty12pn",
  name: "ghost-tailwindcss-cursor-rules",
  tags: [
  "Ghost",
  "Alpine.js",
  "TailwindCSS"
],
  content,
  metadata: {
    authorEmail: "system@cursor.directory",
    created: "2024-11-19T18:49:36.923Z",
    lastModified: "2024-11-19T18:49:36.923Z"
  }
};

export default rule;