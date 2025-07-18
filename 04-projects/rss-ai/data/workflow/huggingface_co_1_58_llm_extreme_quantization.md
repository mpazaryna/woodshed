# Fine-tuning LLMs to 1.58bit: extreme quantization made easy

**Source**: HuggingFace
**Date**: time.struct_time(tm_year=2024, tm_mon=9, tm_mday=18, tm_hour=0, tm_min=0, tm_sec=0, tm_wday=2, tm_yday=262, tm_isdst=0)

- BitNet is a specialized transformers architecture that uses extreme quantization, representing each parameter with only three values (-1, 0, 1). This leads to a model that utilizes just 1.58 bits per parameter, significantly reducing computational and memory requirements.
- Fine-tuning existing models to 1.58 bits using the BitNet architecture has been successful, achieving strong performance on downstream tasks. This approach surpasses other models in benchmarks and outperforms models trained on larger datasets, showcasing efficiency and effectiveness.
- Implementing custom kernels and benchmarks using Triton shows promising results, with the kernel's performance comparable to Torch's matmul function. Additionally, experiments with BitBlas software library demonstrate superior performance in low precision matrix operations.

[Read more](https://huggingface.co/blog/1_58_llm_extreme_quantization)
