# Development Log: Deno Testing Configuration

## Initial Challenge (October 31, 2024)

### Issue: Permission Errors in Tests

When running `deno test`, encountered permission errors:

```bash
error: (in promise) PermissionDenied: Requires env access to "MEDIUM_COOKIE", run again with the --allow-env flag
  cookies: Deno.env.get("MEDIUM_COOKIE") ?? "",
                    ^
```

### Working Command

Full command that successfully runs tests:

```bash
deno test --allow-net --allow-read --allow-write --allow-env article_reader_test.ts
```

### Attempted Solutions

#### 1. Basic deno.json Configuration

```json
{
  "tasks": {
    "test": "deno test --allow-net --allow-read --allow-write --allow-env"
  },
  "permissions": {
    "net": true,
    "read": true,
    "write": true,
    "env": true
  }
}
```

**Result**: Permissions in config file alone don't override Deno's security model requiring explicit flags.

#### 2. Improved Test Organization

Created more robust test setup with environment variable handling:

```typescript
// test_setup.ts
if (!Deno.env.has("MEDIUM_COOKIE")) {
  console.warn(
    "⚠️  MEDIUM_COOKIE environment variable not set. Some tests will be skipped."
  );
}

// Optional: Mock values for CI environment
if (Deno.env.get("TEST_ENV") === "ci") {
  Deno.env.set("MEDIUM_COOKIE", "mock_cookie_for_testing");
}
```

```typescript
// article_reader_test.ts
Deno.test({
  name: "Integration Test: fetchArticle",
  ignore: !Deno.env.has("MEDIUM_COOKIE"),
  async fn() {
    // Test implementation
  },
});
```

### Final Solution

1. Use `deno.json` for task definition:

```json
{
  "tasks": {
    "test": "deno test --allow-net --allow-read --allow-write --allow-env"
  }
}
```

2. Run tests using:

```bash
deno task test
```

## Key Learnings

1. **Deno Security Model**

   - Explicit permissions required even with config file
   - Security-first approach prevents accidental permission grants

2. **Environment Variables**

   - Critical for test configuration
   - Should handle missing env vars gracefully
   - Consider providing mock values for CI/CD

3. **Best Practices**
   - Use `deno task` for consistent command execution
   - Add environment checks in test setup
   - Document required permissions and environment variables

## Next Steps

1. Create comprehensive test setup file
2. Document environment variable requirements in README
3. Set up CI/CD pipeline with appropriate test configuration
4. Consider creating test utilities for common operations

## Required Environment Variables

| Variable      | Purpose                          | Required For           |
| ------------- | -------------------------------- | ---------------------- |
| MEDIUM_COOKIE | Authentication for Medium API    | Article fetching tests |
| TEST_ENV      | Environment indicator (local/ci) | Test configuration     |

## Command Reference

| Command                 | Purpose                                           |
| ----------------------- | ------------------------------------------------- |
| `deno task test`        | Run all tests with required permissions           |
| `deno test --allow-all` | Run tests with all permissions (development only) |
| `deno test --allow-env` | Run tests with minimal permissions                |

---

Last Updated: October 31, 2024
