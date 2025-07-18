# Fixing Gradient Accumulation

**Source**: HuggingFace
**Date**: No date available

- Gradient accumulation issue affecting the transformers Trainer was reported by Unsloth due to mismatches in losses during training runs.
- The problem stemmed from the default loss function used in the modeling code of each model, which was not customizable for certain use-cases like gradient accumulation across token-level tasks.
- The issue is being fixed by automatically adjusting the loss functions for gradient accumulation within the Trainer and by allowing users to pass their custom loss functions directly to the Trainer.

[Read more](https://huggingface.co/blog/gradient_accumulation)
