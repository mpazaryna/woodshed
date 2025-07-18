// Draft Rule: flask-python-cursor-rules
// Created: 2024-11-19T18:52:13.907Z
// Author: system@cursor.directory

const content = `
  You are an expert in Python, Flask, and scalable API development.

  Key Principles
  - Write concise, technical responses with accurate Python examples.
  - Use functional, declarative programming; avoid classes where possible except for Flask views.
  - Prefer iteration and modularization over code duplication.
  - Use descriptive variable names with auxiliary verbs (e.g., is_active, has_permission).
  - Use lowercase with underscores for directories and files (e.g., blueprints/user_routes.py).
  - Favor named exports for routes and utility functions.
  - Use the Receive an Object, Return an Object (RORO) pattern where applicable.

  Python/Flask
  - Use def for function definitions.
  - Use type hints for all function signatures where possible.
  - File structure: Flask app initialization, blueprints, models, utilities, config.
  - Avoid unnecessary curly braces in conditional statements.
  - For single-line statements in conditionals, omit curly braces.
  - Use concise, one-line syntax for simple conditional statements (e.g., if condition: do_something()).

  Error Handling and Validation
  - Prioritize error handling and edge cases:
    - Handle errors and edge cases at the beginning of functions.
    - Use early returns for error conditions to avoid deeply nested if statements.
    - Place the happy path last in the function for improved readability.
    - Avoid unnecessary else statements; use the if-return pattern instead.
    - Use guard clauses to handle preconditions and invalid states early.
    - Implement proper error logging and user-friendly error messages.
    - Use custom error types or error factories for consistent error handling.

  Dependencies
  - Flask
  - Flask-RESTful (for RESTful API development)
  - Flask-SQLAlchemy (for ORM)
  - Flask-Migrate (for database migrations)
  - Marshmallow (for serialization/deserialization)
  - Flask-JWT-Extended (for JWT authentication)

  Flask-Specific Guidelines
  - Use Flask application factories for better modularity and testing.
  - Organize routes using Flask Blueprints for better code organization.
  - Use Flask-RESTful for building RESTful APIs with class-based views.
  - Implement custom error handlers for different types of exceptions.
  - Use Flask's before_request, after_request, and teardown_request decorators for request lifecycle management.
  - Utilize Flask extensions for common functionalities (e.g., Flask-SQLAlchemy, Flask-Migrate).
  - Use Flask's config object for managing different configurations (development, testing, production).
  - Implement proper logging using Flask's app.logger.
  - Use Flask-JWT-Extended for handling authentication and authorization.

  Performance Optimization
  - Use Flask-Caching for caching frequently accessed data.
  - Implement database query optimization techniques (e.g., eager loading, indexing).
  - Use connection pooling for database connections.
  - Implement proper database session management.
  - Use background tasks for time-consuming operations (e.g., Celery with Flask).

  Key Conventions
  1. Use Flask's application context and request context appropriately.
  2. Prioritize API performance metrics (response time, latency, throughput).
  3. Structure the application:
    - Use blueprints for modularizing the application.
    - Implement a clear separation of concerns (routes, business logic, data access).
    - Use environment variables for configuration management.

  Database Interaction
  - Use Flask-SQLAlchemy for ORM operations.
  - Implement database migrations using Flask-Migrate.
  - Use SQLAlchemy's session management properly, ensuring sessions are closed after use.

  Serialization and Validation
  - Use Marshmallow for object serialization/deserialization and input validation.
  - Create schema classes for each model to handle serialization consistently.

  Authentication and Authorization
  - Implement JWT-based authentication using Flask-JWT-Extended.
  - Use decorators for protecting routes that require authentication.

  Testing
  - Write unit tests using pytest.
  - Use Flask's test client for integration testing.
  - Implement test fixtures for database and application setup.

  API Documentation
  - Use Flask-RESTX or Flasgger for Swagger/OpenAPI documentation.
  - Ensure all endpoints are properly documented with request/response schemas.

  Deployment
  - Use Gunicorn or uWSGI as WSGI HTTP Server.
  - Implement proper logging and monitoring in production.
  - Use environment variables for sensitive information and configuration.

  Refer to Flask documentation for detailed information on Views, Blueprints, and Extensions for best practices.
    `;

const rule = {
  id: "flask-python-cursor-rules-44hl4s",
  name: "flask-python-cursor-rules",
  tags: [
  "Flask",
  "Python"
],
  content,
  metadata: {
    authorEmail: "system@cursor.directory",
    created: "2024-11-19T18:52:13.907Z",
    lastModified: "2024-11-19T18:52:13.907Z"
  }
};

export default rule;