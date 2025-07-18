# PRD: Local LLM Capabilities Assessment - YouTube Transcript Summarization

## Project Overview

This document outlines a systematic exploration of local Large Language Model (LLM) capabilities for content summarization, using YouTube transcript summarization as a test case. The project aims to establish clear boundaries of current local LLM capabilities, develop best practices for task decomposition, and create reliable implementation patterns for production applications.

## Background

Local LLMs (specifically Llama3.2 running via Ollama) offer advantages in privacy, cost, and latency compared to cloud-based solutions. However, their performance limitations for complex NLP tasks are not well documented. This research project aims to fill that knowledge gap.

## Test Case: YouTube Transcript Summarization

We've selected YouTube transcript summarization as our benchmark task because it represents a common real-world use case that requires:
- Processing lengthy contexts
- Identifying key entities and topics
- Distinguishing important from peripheral information
- Generating coherent, factually accurate output

## Key Findings

Our initial experiments with Llama3.2 via Ollama have revealed several critical limitations:

### 1. Hallucination Issues

**Finding**: The model consistently fabricates information not present in the source material.

**Evidence**: 
- Invented fictional people (e.g., "Saskia Bailey", "Rhett Baroo")
- Attributed quotes to wrong speakers
- Created fictional events and relationships

**Severity**: High - These hallucinations severely undermine the reliability of the output.

### 2. Context Length Management

**Finding**: The model struggles with the full transcript's length and complexity.

**Evidence**:
- Focus only on early portions of transcript
- Inability to connect related concepts across the transcript
- Missing key information from later sections

**Severity**: High - Results in highly incomplete summaries.

### 3. Instruction Following Challenges

**Finding**: Despite explicit instructions against fabrication, the model continued to generate inaccurate content.

**Evidence**:
- Failed to adhere to explicit "DO NOT invent details" instructions
- Paradoxically, more detailed instructions led to worse adherence
- Provided examples seemed to increase rather than decrease hallucination

**Severity**: High - Undermines reliability of guardrails.

### 4. Model Confusion with Complex Prompts

**Finding**: Sophisticated prompting techniques that work well with cloud LLMs backfire with local models.

**Evidence**:
- Example-based prompts led to mimicking structure without accuracy
- Multi-stage processing (entity extraction + summarization) didn't improve accuracy
- Chain-of-thought prompting didn't reduce hallucination

**Severity**: Medium - Requires different prompting strategies than cloud models.

## Recommended Implementation Approaches

Based on our findings, we recommend the following approaches for working with local LLMs for content summarization tasks:

### Approach 1: Task Decomposition to Atomic Operations

Break complex tasks into the smallest possible components that can be reliably accomplished:

1. **Entity Extraction**: Identify names, places, organizations
2. **Keyword Extraction**: Extract topic-relevant terms
3. **Timestamp Identification**: Map key points to positions in content
4. **Simple Classification**: Categorize content segments into predefined topics

These atomic outputs can then be composed together programmatically or presented directly to users.

### Approach 2: Hybrid Local/Cloud Architecture

Leverage local models for tasks they can handle reliably, with cloud fallback for complex operations:

1. **Local Processing**: Initial processing, filtering, and extraction
2. **Confidence Scoring**: Measuring reliability of local model output
3. **Cloud Fallback**: Routing to cloud APIs when confidence is below threshold
4. **Result Caching**: Storing cloud results to minimize API usage

### Approach 3: Human-in-the-Loop Design

Design applications that leverage human judgment alongside LLM capabilities:

1. **Extraction + Highlighting**: Model extracts key sections for human review
2. **Suggestion Mode**: Model proposes summaries that humans can edit/approve
3. **Verification Prompts**: Model generates verification questions for humans
4. **Interactive Refinement**: Human feedback improves model output iteratively

## Testing Matrix for Capability Assessment

We recommend systematically testing local LLMs against the following variables:

| Variable | Range to Test | Metrics |
|----------|--------------|---------|
| Context Length | 1K, 2K, 4K, 8K tokens | Comprehension accuracy, Key point retention |
| Temperature | 0.1, 0.3, 0.5, 0.7, 1.0 | Hallucination rate, Output diversity |
| Task Complexity | Extraction, Classification, Summarization, Creative | Success rate, Completion time |
| Prompt Structure | Simple, Chain-of-thought, Few-shot, Structured | Instruction adherence, Output quality |

## Development Roadmap

We propose the following development phases for building reliable applications with local LLMs:

### Phase 1: Capability Boundary Mapping
- Develop systematic test suite for local LLM capabilities
- Benchmark against cloud alternatives
- Document specific thresholds where performance degrades

### Phase 2: Component Development
- Build reliable atomic operations libraries
- Develop confidence scoring mechanisms
- Create modular pipeline architecture

### Phase 3: Application Prototypes
- Implement YouTube summarizer with task decomposition
- Build demonstration hybrid architecture
- Create human-in-the-loop interface prototype

### Phase 4: Optimization and Documentation
- Performance optimization
- Best practices documentation
- Pattern library

## Success Metrics

The project will be considered successful if it achieves:

1. **Defined Capability Map**: Clear documentation of what local LLMs can and cannot reliably accomplish
2. **Reliable Component Library**: Set of atomic operations with >95% accuracy
3. **Working Prototype**: YouTube summarizer that produces factually accurate, useful summaries
4. **Performance Benchmarks**: Quantitative comparison of local vs. cloud approaches

## Additional Considerations

### Ethical and Bias Concerns
Local LLMs may inherit biases from their training data. Applications should include appropriate safeguards.

### Performance Optimization
Local inference speed depends heavily on hardware configuration. Applications should be optimized for target environments.

### Model Evolution
This assessment is specific to Llama3.2 via Ollama. Newer models may offer improved capabilities.

## Conclusion

Local LLMs represent a promising technology for building privacy-preserving, cost-effective applications. However, their current limitations require careful application design. By systematically mapping capabilities and implementing appropriate architecture patterns, developers can leverage local LLMs effectively while mitigating their limitations.

## Command Line Usage

Basic usage:
```
deno task start https://youtu.be/M0tq_xL04n0\?si\=w_A0eAHKdr90sBwN
```

With chunk selection options:
```
# Process only chunks 2 through 5
deno task start https://youtu.be/VideoID --start-chunk 2 --end-chunk 5

# Process only specific chunks (0, 3, and 6)
deno task start https://youtu.be/VideoID --chunks 0,3,6
```

Available options:
- `--start-chunk` or `-s`: Index of the first chunk to process (0-based)
- `--end-chunk` or `-e`: Index of the last chunk to process (0-based)
- `--chunks` or `-c`: Comma-separated list of specific chunk indices to process