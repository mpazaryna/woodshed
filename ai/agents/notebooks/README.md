# A Collection of Agent Notebooks

## Concepts

### Planning

Planning is a strategic element for agents, through planning agents determine the steps to achieve a goal. There are several techniques:

* Reflexion 
* Chain of Thought 
* Decomposition 
* ReAct 

### Tools

Once we have plans to solve our problems, tools are the functional aspects that enable agents to carry out those plans.

* Retrieval
* Search
* Code Interpreter
* Math

### Memory

The agent’s memory has two categories: short-term and long-term memories.

Short-term Memory: In context memory allows the agent to utilize the short-term memory of the large language model to operate the original problem from the beginning. This capability allows the agent to hold temporarily the information and process it when it is necessary for the task execution.

Long-term Memory: The ability to retain and recall information after the end of the conversations. We leverage often an external database to extend this knowledge which could be precious for further knowledge learning.

Semantic or standard cache: as an extension of long-term memory, it is possible to store the pair of instructions and LLM answers in a database, a vector store, or a database that has vector capability. Before sending the next query to LLM, the agent could check the cache to accelerate the response time and reduce the cost of calling API-based LLM.

* Short term
* Long term
* Semantic

## References

Ph.D. ☕️, Han HELOIR. “The Future of Generative AI Is Agentic: What You Need to Know.” Medium, May 7, 2024. https://towardsdatascience.com/the-future-of-generative-ai-is-agentic-what-you-need-to-know-01b7e801fa69.

