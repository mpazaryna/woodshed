# 📁 prompts/analysis/graph-performance.md
```markdown
# Graph Analysis and Performance Prompts

## Graph Performance Review
### Context
Used when analyzing graph algorithms and data structures for performance optimization.

### Prompt
You are an expert software developer or site reliability engineer, and your job is to ensure that this code runs effectively, quickly, at scale, and securely. Please profile it, and find any issues that need to be fixed or updated.

### Response Should Cover
1. Time complexity analysis
2. Space complexity analysis
3. Scalability considerations
4. Memory usage patterns
5. Potential bottlenecks
6. Security considerations
7. Optimization recommendations

### Example Areas to Focus On
- Node traversal efficiency
- Edge representation
- Memory allocation patterns
- Cache utilization
- Parallel processing opportunities
- Input validation
- Resource management

### Tags
#graphs #performance #scalability #optimization #sre

### Use Cases
- Large-scale graph processing
- Social network analysis
- Route optimization
- Dependency analysis
- Network flow problems

### Version History
- v1.0: Initial prompt (2024-10-25)
```

# 📁 prompts/templates/graph-analysis.md
```markdown
# Graph Analysis Templates

## Performance Analysis Template
### Context
Template for analyzing graph-based algorithms and data structures.

### Prompt Structure
As an {expert_role} analyzing this graph-based code:

```[code block]```

Please evaluate the following aspects:
1. Performance Characteristics
   - Time complexity
   - Space complexity
   - Memory usage patterns

2. Scalability Considerations
   - Large dataset handling
   - Memory constraints
   - Processing bottlenecks

3. Security Aspects
   - Input validation
   - Resource constraints
   - Denial of service prevention

4. Optimization Opportunities
   - Algorithm improvements
   - Data structure choices
   - Caching strategies
   - Parallel processing potential

### Variables
- expert_role: ["site reliability engineer", "performance engineer", "graph algorithm specialist"]
- focus_areas: ["performance", "scalability", "security", "optimization"]

### Tags
#graphs #performance #templates #analysis

### Common Use Cases
- Social network analysis
- Route optimization
- Dependency graphs
- Network flow
- Tree traversal

