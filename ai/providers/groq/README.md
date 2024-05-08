# Groq Explorations

## Running the tests in Lightning.AI

export PYTHONPATH="${PYTHONPATH}:/teamspace/studios/this_studio/woodshed/ai/groq"

## Models

### Llama

Meta developed and released the Meta Llama 3 family of large language models (LLMs), a collection of pretrained and instruction tuned generative text models in 8 and 70B sizes. The Llama 3 instruction tuned models are optimized for dialogue use cases and outperform many of the available open source chat models on common industry benchmarks. Further, in developing these models, we took great care to optimize helpfulness and safety.

- https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct
- https://huggingface.co/meta-llama/Meta-Llama-3-70B-Instruct

### Gemma

Gemma 1.1 was trained using a novel RLHF method, leading to substantial gains on quality, coding capabilities, factuality, instruction following and multi-turn conversation quality. We also fixed a bug in multi-turn conversations, and made sure that model responses don't always start with "Sure,".

We believe this release represents an improvement for most use cases, but we encourage users to test in their particular applications. The previous model will continue to be available in the same repo. We appreciate the enthusiastic adoption of Gemma, and we continue to welcome all feedback from the community.

https://huggingface.co/google/gemma-1.1-7b-it

### Mixtral

The Mixtral-8x7B Large Language Model (LLM) is a pretrained generative Sparse Mixture of Experts. The Mixtral-8x7B outperforms Llama 2 70B on most benchmarks we tested.

https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1