# Faster Assisted Generation with Dynamic Speculation

**Source**: HuggingFace
**Date**: No date available

- Dynamic speculative decoding is a new method developed by Intel labs and Hugging Face to accelerate text generation by up to 2.7 times.
- Speculative decoding involves splitting the generative process into two stages, where a draft model generates tokens quickly and a target model verifies them in parallel.
- The dynamic approach for adjusting speculation lookahead values during inference outperforms the heuristic approach across various tasks and model pairings, showing better performance in all tests and yielding significant speedups.

[Read more](https://huggingface.co/blog/dynamic_speculation_lookahead)
