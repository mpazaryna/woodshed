export const react_components_creationRules = [{
    title: "react-components-creation",
    tags: [],
    slug: "react-components-creation",
    libs: [],
    content: `# Cursor Rules## Whenever you need a React component1. Carefully consider the component's purpose, functionality, and design2. Think slowly, step by step, and outline your reasoning3. Check if a similar component already exists in any of the following locations  1. packages/ui/src/components  2. apps/spa/src/components4. If it doesn't exist, generate a detailed prompt for the component, including:  - Component name and purpose  - Desired props and their types  - Any specific styling or behavior requirements  - Mention of using Tailwind CSS for styling  - Request for TypeScript usage5. URL encode the prompt.6. Create a clickable link in this format:  [ComponentName](https://v0.dev/chat?q={encoded_prompt})7. After generating, adapt the component to fit our project structure:  - Import   - common shadcn/ui components from <ui_package_alias>@repo/ui/components/ui/</ui_package_alias>   - app specific components from <app_package_alias>@/components</app_package_alias>  - Ensure it follows our existing component patterns  - Add any necessary custom logic or state managementExample prompt template:"Create a React component named {ComponentName} using TypeScript and Tailwind CSS.It should {description of functionality}. Props should include {list of props with types}.The component should {any specific styling or behavior notes}. Please provide the full component code."Remember to replace placeholders like <ui_package_path> and <app_package_alias> with the actual values used in your project.`,
    author: {
      name: "System",
      url: "",
      avatar: "",
      email: ""
    }
  }];