export const htmx_flaskRules = [{
    title: "htmx-flask",
    tags: [],
    slug: "htmx-flask",
    libs: [],
    content: `// HTMX with Flask .cursorrules

// HTMX and Flask best practices
const htmxFlaskBestPractices = [
  "Use Flask's render_template for server-side rendering",
  "Implement Flask-WTF for form handling",
  "Utilize Flask's url_for for generating URLs",
  "Use Flask's jsonify for JSON responses",
  "Implement Flask-SQLAlchemy for database operations",
  "Utilize Flask's Blueprint for modular applications",
];

// Folder structure
const folderStructure = \`
app/
  templates/
  static/
    css/
    js/
  models/
  routes/
  __init__.py
config.py
run.py
\`;

// Additional instructions
const additionalInstructions = \`
1. Use Jinja2 templating with HTMX attributes
2. Implement proper CSRF protection with Flask-WTF
3. Utilize Flask's request object for handling HTMX requests
4. Use Flask-Migrate for database migrations
5. Implement proper error handling and logging
6. Follow Flask's application factory pattern
7. Use environment variables for configuration
\`;
`,
    author: {
      name: "System",
      url: "",
      avatar: "",
      email: ""
    }
  }];