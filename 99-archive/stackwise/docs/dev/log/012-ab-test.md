# Development Log: A/B Testing Preparation System

**Date:** January 10, 2025

## Architecture Decision

The A/B Testing Preparation System implements a clean, structured approach to preparing story framework primitives for comparative testing. The system handles the preparation of test candidates while carefully preserving metadata and maintaining separation between original and improved versions. This approach was chosen to enable systematic comparison of primitive improvements while ensuring the integrity of the source material.

## Core Components

```ascii
src/
  └── prep_ab.ts       # A/B test preparation engine
```

## Directory Structure

```ascii
data/
  ├── primitives/          # Original source primitives
  ├── improve/            # Improvement results
  │   └── [framework]/
  │       └── *-improved-[focus].md
  └── candidates/         # Test candidates
      └── [framework]/
          ├── a/         # Original versions
          ├── b/         # Improved versions
          └── test-manifest.json
```

## Implementation Details

The system implements a careful content handling pipeline:

1. **Content Extraction**
   - Frontmatter preservation
   - Content cleaning
   - Metadata handling

2. **Test Preparation**
   - Separate directories for variants
   - Clean content organization
   - Manifest generation

## Core Functions

Key functionality centers around these primary functions:

- `extractContent()`: Separates frontmatter and content
- `extractCleanContent()`: Removes improvement metadata
- `prepareTestCandidates()`: Organizes test versions

## Processing Pipeline

1. Source Processing
   - Original primitive loading
   - Frontmatter extraction
   - Content validation

2. Improvement Processing
   - Improved content loading
   - Metadata cleaning
   - Content extraction

3. Test Setup
   - Directory creation
   - Content organization
   - Manifest generation

## Technical Considerations

### Content Cleaning

The system carefully handles content extraction:

```typescript
function extractCleanContent(improvedContent: string): string {
  // Find and extract the actual content after markers
  const contentMarkers = [
    '# SIMPLIFIED CONTENT',
    '# MODULARIZED CONTENT',
    '# FLEXIBLE CONTENT'
  ];
  
  // Remove any remaining YAML frontmatter blocks
  while (cleanContent.includes('---')) {
    const start = cleanContent.indexOf('---');
    const end = cleanContent.indexOf('---', start + 3);
    if (end === -1) break;
    cleanContent = cleanContent.slice(end + 3).trim();
  }
}
```

### Test Manifest

Generates a structured test manifest:

```typescript
const manifest = {
  timestamp: new Date().toISOString(),
  test_path: relativePath,
  versions: {
    a: "Original version",
    b: "Improved version"
  },
  files: Array.from(processedFiles)
};
```

## Future Scope

Potential enhancements include:

1. **Enhanced Testing**
   - Multiple variant support (A/B/C testing)
   - Automated test execution
   - Result collection and analysis

2. **Content Management**
   - Version tracking
   - Change history
   - Improvement metrics

3. **Integration Features**
   - CI/CD pipeline integration
   - Automated testing workflows
   - Results reporting

## Benefits

1. **Clean Separation**
   - Original content preservation
   - Clear version organization
   - Structured test setup

2. **Metadata Management**
   - Frontmatter preservation
   - Clean content extraction
   - Test tracking

3. **Testing Infrastructure**
   - Ready for automation
   - Clear structure
   - Easy to extend

## Conclusion

The A/B Testing Preparation System provides a robust foundation for organizing and preparing primitive variants for testing. Its careful handling of content and metadata, combined with clear structural organization, ensures reliable and systematic testing of improvements while maintaining the integrity of the original primitives.

## Usage Guidelines

```bash
deno run --allow-read --allow-write src/prep_ab.ts --dir ./data/primitives/system/story/hero
```
