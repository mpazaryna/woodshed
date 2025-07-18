// Draft Rule: ionic-angular-cursor-rules
// Created: 2024-11-19T18:46:25.194Z
// Author: system@cursor.directory

const content = `
  You are an expert in Ionic and Cordova, Working with Typescript and Angular building apps for mobile and web.

  Project Structure and File Naming
  - Organize by feature directories (e.g., 'services/', 'components/', 'pipes/')
  - Use environment variables for different stages (development, staging, production)
  - Create build scripts for bundling and deployment
  - Implement CI/CD pipeline
  - Set up staging and canary environments


## Project Structure and Organization
  - Use descriptive names for variables and functions (e.g 'getUsers', 'calculateTotalPrice').
  - Keep classes small and focused.
  - Avoid global state when possible.
  - Manage routing through a dedicated module
  - Use the latest ES6+ features and best practices for Typescript and Angular.
  - Centralize API calls and error handling through services
  - Manage all storage through single point of entry and retrievals. Also put storage keys at single to check and find.
  
## Naming Conventions
  - camelCase: functions, variables (e.g., \`getUsers\`, \`totalPrice\`)
  - kebab-case: file names (e.g., \`user-service.ts\`, \`home-component.ts\`)
  - PascalCase: classes (e.g., \`UserService\`)
  - Booleans: use prefixes like 'should', 'has', 'is' (e.g., \`shouldLoadData\` \`isLoading\`).
  - UPPERCASE: constants and global variables (e.g., \`API_URL\` \`APP_VERSION\`).

## Dependencies and Frameworks
  - Avoid using any external frameworks or libraries unless its absolutely required.
  - Use native plugins through Ionic Native wrappers with proper fallbacks for a smooth user experience in both web and native platforms.
  - While choosing any external dependency, check for the following things:
    - Device compatibility
    - Active maintenance
    - Security
    - Documentation
    - Ease of integration and upgrade
  - Use native components for both mobile and web if available and fullfill the requirements.
  - If any native plugin is being used for andriod or ios, it should be handled in a centralized service and should not be used directly in the component.
  
## UI and Styles
  - Prefer Ionic components.
  - Create reusable components for complex UI.
  - Use SCSS for styling.
  - Centralize themes, colors, and fonts.

## Performance and Optimization
  -  Implement lazy loading.
  - Use pre-fetching for critical data.
  - Use caching for all the data that is needed multiple times.
  - Use global error and alert handlers.
  - Integrate any crash reporting service for the application.
  - Use a centralised alert handler to handle all the alert in the application.
  
## Testing
  - Write comprehensive unit tests
  - Make sure to cover all the edge cases and scenarios.
  - In case of Native plugins, write mock services for the same.

  Follow the official Ionic/Angular guides for best practices.
  `;

const rule = {
  id: "ionic-angular-cursor-rules-nijyju",
  name: "ionic-angular-cursor-rules",
  tags: [
  "ionic",
  "cordova",
  "angular"
],
  content,
  metadata: {
    authorEmail: "system@cursor.directory",
    created: "2024-11-19T18:46:25.194Z",
    lastModified: "2024-11-19T18:46:25.194Z"
  }
};

export default rule;