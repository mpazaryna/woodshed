export const typescript_react_nextui_supabase_cursorrules_prompRules = [{
    title: "typescript-react-nextui-supabase-cursorrules-promp",
    tags: [],
    slug: "typescript-react-nextui-supabase-cursorrules-promp",
    libs: [],
    content: `# Codebase OverviewThis codebase appears to be part of a web application built using TypeScript, React, and various NextUI components. It is structured to support a landing page, authentication flows, and a dashboard for logged-in users. The application integrates with Supabase for backend services, including authentication and database interactions.# Stack and Key TechnologiesFrontend Framework: ReactTypeScript: Used for type-safe code across the frontend.NextUI: A React UI library used for building the UI components like buttons, modals, inputs, etc.Supabase: An open-source Firebase alternative used for backend services like authentication, database, and storage.Next.js: Likely used as the React framework, indicated by the usage of next/navigation and server utilities.Iconify: For icons across the application.Purpose and Functionality## AuthenticationThe application includes a comprehensive authentication flow:Login: Users can log in using email/password or GitHub OAuth. The login logic is handled in frontend/app/(landing-page)/login/action.ts.Signup: New users can sign up with an email and password. The signup logic is also in frontend/app/(landing-page)/login/action.ts.Logout: Users can log out, with the logic located in frontend/app/(landing-page)/logout/action.ts.Email Confirmation: The application handles email confirmation through a callback route in frontend/app/auth/callback/confirm/route.ts.## User InterfaceLanding Page: Contains components like SubmitButton, LoginPage, and LogoutModal to facilitate user interactions.Dashboard: For logged-in users, showing personalized content and a sidebar for navigation within the dashboard.Error Handling: A generic error component is used to display errors and provide a retry mechanism.## Navigation and LayoutNavbar: A responsive navbar for the landing page and possibly other public pages.Sidebar: A collapsible sidebar for the dashboard, indicating a more complex, multi-page application structure for authenticated users.`,
    author: {
      name: "System",
      url: "",
      avatar: "",
      email: ""
    }
  }];