export const htmx_go_basicRules = [{
    title: "htmx-go-basic",
    tags: [],
    slug: "htmx-go-basic",
    libs: [],
    content: `// HTMX with Go (Basic Setup) .cursorrules

// HTMX and Go best practices
const htmxGoBestPractices = [
  "Use html/template for server-side rendering",
  "Implement http.HandlerFunc for handling HTMX requests",
  "Utilize gorilla/mux for routing if needed",
  "Use encoding/json for JSON responses",
  "Implement proper error handling and logging",
  "Utilize context for request cancellation and timeouts",
];

// Folder structure
const folderStructure = \`
cmd/
  main.go
internal/
  handlers/
  models/
  templates/
static/
  css/
  js/
go.mod
go.sum
\`;

// Additional instructions
const additionalInstructions = \`
1. Use semantic HTML5 elements with HTMX attributes
2. Implement proper CSRF protection
3. Utilize HTMX extensions when needed
4. Use hx-boost for full page navigation
5. Follow Go's idiomatic error handling
6. Implement graceful shutdown for the server
7. Use Go modules for dependency management
\`;
`,
    author: {
      name: "System",
      url: "",
      avatar: "",
      email: ""
    }
  }];