# Testing Strategy for LLM Module

## Overview

This document outlines our comprehensive testing strategy for the TypeScript LLM module. We employ a three-tiered testing approach with distinct responsibilities and characteristics at each level.

## Testing Pyramid

```ascii
    /\
   /E2E\
  /─────\
 /Integration\
/─────────────\
   Unit Tests
```

### 1. Unit Tests (`tests/unit/`)

Unit tests form the foundation of our testing strategy, focusing on testing individual components in complete isolation.

#### Key Characteristics

- Test single units of code (functions, modules)
- No external dependencies
- No network calls
- No file system access
- Fast execution (milliseconds)
- High coverage (aim for >90%)

#### Example: Testing Environment Variable Handling

```typescript
Deno.test('unit: getRequiredEnvVar', async (t) => {
  await t.step('returns value when set', () => {
    Deno.env.set('TEST_VAR', 'test-value')
    assertEquals(getRequiredEnvVar('TEST_VAR'), 'test-value')
    Deno.env.delete('TEST_VAR')
  })
})
```

#### When to Write Unit Tests

- For pure functions
- For complex business logic
- For error handling paths
- For data transformations
- For configuration validation

### 2. Integration Tests (`tests/integration/`)

Integration tests verify that different components of our system work together correctly.

#### Key Characteristics

- Test multiple components together
- Mock external dependencies
- Test component interactions
- Test error propagation
- Medium execution speed
- Medium coverage (aim for >70%)

#### Example: Testing Client-Factory Integration

```typescript
Deno.test('integration: claude client creation', async (t) => {
  // Mock external dependencies
  mockFetch(200, {
    content: [{ text: 'response', type: 'text' }],
    role: 'assistant',
    usage: { input_tokens: 10, output_tokens: 20 },
  })

  // Test component interaction
  const client = createLLMClient('claude', config)
  const result = await client.complete([...])
  
  // Verify integrated behavior
  assertEquals(result.message.content, 'response')
})
```

#### When to Write Integration Tests

- For component interactions
- For configuration flow
- For error propagation chains
- For middleware behavior
- For state management between components

### 3. End-to-End Tests (`tests/e2e/`)

E2E tests verify the entire system works together with real external dependencies.

#### Key Characteristics

- Test complete user scenarios
- Use real external services
- Test actual network calls
- Slowest execution
- Lowest coverage (aim for >50%)
- Most brittle tests

#### Example: Testing Real API Integration

```typescript
Deno.test({
  name: 'e2e: claude complete flow',
  ignore: !Deno.env.get('ANTHROPIC_API_KEY'),
  async fn(t) {
    const client = createLLMClient('claude', {
      apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
    })
    const result = await client.complete([...])
    assert(result.message.content.includes('expected response'))
  },
})
```

#### When to Write E2E Tests

- For critical user paths
- For API contract verification
- For performance testing
- For real-world scenarios
- For integration verification

## Test Organization

### Directory Structure

```ascii
tests/
├── unit/           # Unit tests
│   ├── env_test.ts
│   └── factory_test.ts
├── integration/    # Integration tests
│   └── claude_integration_test.ts
└── e2e/           # E2E tests
    └── claude_e2e_test.ts
```

### Naming Conventions

- Test files: `*_test.ts`
- Test descriptions: `<level>: <component> - <scenario>`
- Test steps: `<action> <condition>`

## Testing Best Practices

### 1. Test Independence

- Each test should be able to run in isolation
- Clean up after each test
- Don't rely on test execution order
- Reset mocks between tests

### 2. Test Data Management

```typescript
// Good: Independent test data
await t.step('processes data', () => {
  const testData = createTestData()  // Fresh data per test
  const result = process(testData)
  assertEquals(result, expected)
})
```

### 3. Mock Management

```typescript
// Store original
const original = globalThis.fetch

// Mock for test
globalThis.fetch = mockImplementation

// Restore after test
t.teardown(() => {
  globalThis.fetch = original
})
```

### 4. Error Testing

```typescript
// Test both success and error paths
await assertRejects(
  () => functionThatShouldFail(),
  ErrorType,
  'Expected error message'
)
```

## Test Execution Strategy

### Local Development

```bash
# Run unit tests only (fast feedback)
deno test tests/unit/ --allow-env

# Run integration tests
deno test tests/integration/ --allow-env

# Run E2E tests (needs API keys)
deno test tests/e2e/ --allow-env --allow-net
```

### CI/CD Pipeline

1. Unit tests run on every commit
2. Integration tests run on PR
3. E2E tests run before deployment

## Advanced Testing Patterns

### 1. Test Fixtures

```typescript
function createTestClient(config?: Partial<LLMConfig>) {
  return createLLMClient('claude', {
    apiKey: 'test-key',
    ...config,
  })
}
```

### 2. Parameterized Tests

```typescript
for (const provider of ['claude', 'gemini', 'openai'] as const) {
  await t.step(`handles ${provider} configuration`, () => {
    // Test with different providers
  })
}
```

### 3. Test Doubles

- **Stubs**: Return fixed values
- **Spies**: Record calls
- **Mocks**: Verify interactions
- **Fakes**: Simplified implementations

### 4. Contract Testing

- Test API shapes
- Verify type compatibility
- Ensure consistent interfaces

## Continuous Improvement

### Metrics to Track

- Test coverage
- Test execution time
- Test reliability
- Failed test patterns

### Regular Reviews

- Review test quality
- Update test patterns
- Remove obsolete tests
- Improve test documentation

## Debugging Tests

### Common Issues

1. Network dependency failures
2. Race conditions
3. Resource cleanup
4. Environment inconsistencies

### Solutions

1. Use `--inspect-brk` for debugging
2. Add detailed logging
3. Isolate dependencies
4. Use test timeouts

## Future Considerations

### 1. Property-Based Testing

Consider adding property-based tests for:

- Message format validation
- Token counting
- Error handling

### 2. Performance Testing

Add performance tests for:

- Response time
- Token usage
- Rate limiting

### 3. Security Testing

Implement security tests for:

- API key handling
- Error message safety
- Input validation
