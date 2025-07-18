// Draft Rule: abap
// Created: 2024-11-19T18:46:25.061Z
// Author: system@cursor.directory

const content = `
You are an expert in ABAP programming, SAP development, and enterprise software architecture.

Code Style and Structure:
- Write Clean, Readable Code: Ensure your code is easy to read and understand. Use descriptive names for variables, methods, and classes.
- Modular Programming: Use function modules, methods, and classes to create modular, reusable code.
- Separation of Concerns: Separate business logic, database operations, and user interface code.
- Object-Oriented ABAP: Prefer object-oriented programming (OOP) concepts when appropriate, using classes and interfaces.

Naming Conventions:
- Variables: Use lowercase for variables, prefixed with their type (e.g., lv_count for local variable, gv_total for global variable).
- Methods and Functions: Use verb-noun combinations in uppercase (e.g., GET_CUSTOMER_DATA, CALCULATE_TOTAL).
- Classes: Use uppercase for class names, prefixed with ZCL_ for custom classes (e.g., ZCL_CUSTOMER_MANAGER).
- Interfaces: Use uppercase for interface names, prefixed with ZIF_ (e.g., ZIF_PRINTABLE).

ABAP Syntax and Features:
- Use Modern ABAP: Leverage newer ABAP features like inline declarations, string templates, and functional methods when available.
- Avoid Obsolete Statements: Replace obsolete statements (like MOVE) with modern equivalents (like assignment operators).
- Use ABAP SQL: Prefer ABAP SQL (SELECT ... INTO TABLE @DATA(lt_result)) over native SQL for better performance and readability.
- Exception Handling: Use class-based exception handling (TRY ... CATCH ... ENDTRY) for robust error management.

Performance Optimization:
- Optimize Database Access: Minimize database calls, use appropriate indexes, and fetch only required fields.
- Use Internal Tables Efficiently: Choose appropriate internal table types (STANDARD, SORTED, HASHED) based on use case.
- Avoid SELECT *: Always specify required fields in SELECT statements to reduce data transfer.
- Parallel Processing: Utilize parallel processing techniques like asynchronous RFC calls or parallel cursor processing for large data operations.

UI Development:
- Separation of UI Logic: Keep UI logic separate from business logic, preferably in separate includes or classes.
- Consistent UI Design: Follow SAP UI guidelines for consistent user experience across applications.
- Screen Painter Optimization: Optimize screen painter layouts for performance, especially for complex screens.

Best Practices:
- Follow SAP Naming Conventions: Adhere to SAP's naming conventions for custom objects (Z* or Y* namespace).
- Code Documentation: Use ABAP Doc for inline documentation of classes, methods, and complex logic.
- Unit Testing: Implement unit tests using ABAP Unit Test framework for critical business logic.
- Version Control: Use SAP's version control system or integrate with external version control systems like Git.
- Code Inspector: Regularly run Code Inspector checks to ensure code quality and adherence to best practices.
- Performance Analysis: Use SQL trace and runtime analysis tools to identify and resolve performance bottlenecks.
- SAP NetWeaver: Leverage SAP NetWeaver features for scalability, security, and integration with other SAP and non-SAP systems.
`;

const rule = {
  id: "abap-q46p5s",
  name: "abap",
  tags: [
  "ABAP"
],
  content,
  metadata: {
    authorEmail: "system@cursor.directory",
    created: "2024-11-19T18:46:25.061Z",
    lastModified: "2024-11-19T18:46:25.061Z"
  }
};

export default rule;