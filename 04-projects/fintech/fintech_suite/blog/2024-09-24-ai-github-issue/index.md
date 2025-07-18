---
slug: ai-powered-ticket-creation
title: Improving Issue Tickets with AI
authors: [paz]
tags: [AI, software development, project management]
---

In the software development, creating a detailed and well-structured work request is crucial. Integrating AI to streamline ticket creation improves efficiency and aligns with the ongoing adoption of AI tools in development pipelines.

<!-- truncate -->

In this blog post, we'll explore how AI was utilized to create comprehensive tickets and work plans, using this real-world example from the trading_kit project.

## The Challenge: Refactoring for Modularity

The trading_kit module required a refactoring: while it effectively used pandas Series for data manipulation, this approach created friction when integrating with modern web frameworks and serverless architectures. We needed to enhance the module's flexibility without sacrificing its powerful analytical capabilities.

## AI Assistance

Using AI, we generated a detailed GitHub issue that not only outlined the problem but also provided a comprehensive plan for implementing the solution. **You can view the full ticket [here](https://github.com/mpazaryna/trading_kit/issues/1).**

Let's break down how AI contributed to creating this thorough ticket:

1. **Clear Problem Statement**: The AI articulated the current implementation's limitations and the need for change.

2. **Proposed Solution**: It suggested a decorator-based approach to allow trading_kit to work with both pandas Series and dictionaries.

3. **Implementation Details**: The ticket included specific code snippets and file locations for the proposed changes. Here's a taste of the complexity:

```python
def dict_io(func: Callable) -> Callable:
    @wraps(func)
    def wrapper(*args, **kwargs):
        if args and isinstance(args[0], dict):
            args = list(args)
            args[0] = pd.Series(args[0])
        
        result = func(*args, **kwargs)
        
        if isinstance(result, pd.Series):
            return result.to_dict()
        elif isinstance(result, tuple) and all(isinstance(item, pd.Series) for item in result):
            return tuple(item.to_dict() for item in result)
        else:
            return result
    
    return wrapper
```

4. **Refactoring Checklist**: The AI provided a detailed checklist for both the trading_kit module and the FastAPI implementation.

5. **Rationale and Best Practices**: The ticket included a summary explaining why this refactoring aligns with software design principles and Python best practices.

## Benefits

1. **Comprehensive Overview**: AI can generate a holistic view of the problem and solution.

2. **Time Savings**: Developers can focus on implementation rather than spending time crafting detailed tickets.

3. **Consistency**: The tickets can be made to have a consistent structure, making them easier for team members to understand.

4. **Educational Aspect**: Less experienced team members can learn from the detailed explanations and rationales provided in the tickets.

5. **Improved Planning**: The level of detail facilitates more accurate time estimations and resource allocation.

## Conclusion

By leveraging AI in ticket creation, we can significantly enhance our software development process. The trading_kit refactoring ticket demonstrates how AI can provide a clear, comprehensive, and actionable plan for tackling complex development tasks.

As we continue to explore the possibilities of AI in software development, we're excited about its potential to streamline processes, improve communication, and ultimately deliver better software faster.
