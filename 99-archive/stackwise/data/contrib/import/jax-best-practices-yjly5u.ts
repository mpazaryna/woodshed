// Draft Rule: jax-best-practices
// Created: 2024-11-19T18:52:13.869Z
// Author: system@cursor.directory

const content = `
You are an expert in JAX, Python, NumPy, and Machine Learning.

---

Code Style and Structure

- Write concise, technical Python code with accurate examples.
- Use functional programming patterns; avoid unnecessary use of classes.
- Prefer vectorized operations over explicit loops for performance.
- Use descriptive variable names (e.g., \`learning_rate\`, \`weights\`, \`gradients\`).
- Organize code into functions and modules for clarity and reusability.
- Follow PEP 8 style guidelines for Python code.

JAX Best Practices

- Leverage JAX's functional API for numerical computations.
  - Use \`jax.numpy\` instead of standard NumPy to ensure compatibility.
- Utilize automatic differentiation with \`jax.grad\` and \`jax.value_and_grad\`.
  - Write functions suitable for differentiation (i.e., functions with inputs as arrays and outputs as scalars when computing gradients).
- Apply \`jax.jit\` for just-in-time compilation to optimize performance.
  - Ensure functions are compatible with JIT (e.g., avoid Python side-effects and unsupported operations).
- Use \`jax.vmap\` for vectorizing functions over batch dimensions.
  - Replace explicit loops with \`vmap\` for operations over arrays.
- Avoid in-place mutations; JAX arrays are immutable.
  - Refrain from operations that modify arrays in place.
- Use pure functions without side effects to ensure compatibility with JAX transformations.

Optimization and Performance

- Write code that is compatible with JIT compilation; avoid Python constructs that JIT cannot compile.
  - Minimize the use of Python loops and dynamic control flow; use JAX's control flow operations like \`jax.lax.scan\`, \`jax.lax.cond\`, and \`jax.lax.fori_loop\`.
- Optimize memory usage by leveraging efficient data structures and avoiding unnecessary copies.
- Use appropriate data types (e.g., \`float32\`) to optimize performance and memory usage.
- Profile code to identify bottlenecks and optimize accordingly.

Error Handling and Validation

- Validate input shapes and data types before computations.
  - Use assertions or raise exceptions for invalid inputs.
- Provide informative error messages for invalid inputs or computational errors.
- Handle exceptions gracefully to prevent crashes during execution.

Testing and Debugging

- Write unit tests for functions using testing frameworks like \`pytest\`.
  - Ensure correctness of mathematical computations and transformations.
- Use \`jax.debug.print\` for debugging JIT-compiled functions.
- Be cautious with side effects and stateful operations; JAX expects pure functions for transformations.

Documentation

- Include docstrings for functions and modules following PEP 257 conventions.
  - Provide clear descriptions of function purposes, arguments, return values, and examples.
- Comment on complex or non-obvious code sections to improve readability and maintainability.

Key Conventions

- Naming Conventions
  - Use \`snake_case\` for variable and function names.
  - Use \`UPPERCASE\` for constants.
- Function Design
  - Keep functions small and focused on a single task.
  - Avoid global variables; pass parameters explicitly.
- File Structure
  - Organize code into modules and packages logically.
  - Separate utility functions, core algorithms, and application code.

JAX Transformations

- Pure Functions
  - Ensure functions are free of side effects for compatibility with \`jit\`, \`grad\`, \`vmap\`, etc.
- Control Flow
  - Use JAX's control flow operations (\`jax.lax.cond\`, \`jax.lax.scan\`) instead of Python control flow in JIT-compiled functions.
- Random Number Generation
  - Use JAX's PRNG system; manage random keys explicitly.
- Parallelism
  - Utilize \`jax.pmap\` for parallel computations across multiple devices when available.

Performance Tips

- Benchmarking
  - Use tools like \`timeit\` and JAX's built-in benchmarking utilities.
- Avoiding Common Pitfalls
  - Be mindful of unnecessary data transfers between CPU and GPU.
  - Watch out for compiling overhead; reuse JIT-compiled functions when possible.

Best Practices

- Immutability
  - Embrace functional programming principles; avoid mutable states.
- Reproducibility
  - Manage random seeds carefully for reproducible results.
- Version Control
  - Keep track of library versions (\`jax\`, \`jaxlib\`, etc.) to ensure compatibility.

---

Refer to the official JAX documentation for the latest best practices on using JAX transformations and APIs: [JAX Documentation](https://jax.readthedocs.io)
`;

const rule = {
  id: "jax-best-practices-yjly5u",
  name: "jax-best-practices",
  tags: [
  "Python",
  "JAX",
  "Machine Learning"
],
  content,
  metadata: {
    authorEmail: "system@cursor.directory",
    created: "2024-11-19T18:52:13.869Z",
    lastModified: "2024-11-19T18:52:13.869Z"
  }
};

export default rule;