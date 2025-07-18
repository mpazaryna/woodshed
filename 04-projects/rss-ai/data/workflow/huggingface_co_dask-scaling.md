# Scaling AI-based Data Processing with Hugging Face + Dask

**Source**: HuggingFace
**Date**: No date available

- The Hugging Face platform provides datasets and pre-trained models that make using and training machine learning models more accessible, but scaling AI tasks can be challenging due to large datasets and computational expenses.
- Dask, a Python library for distributed computing, allows handling out-of-core computing by breaking datasets into manageable chunks and supports efficient data loading and preprocessing of TB-scale datasets and parallel model inference, including multi-node GPU inference.
- The article showcases an example where data processing was done on the FineWeb dataset first with pandas for 100 rows, and then scaled to 211 million rows using Dask across multiple GPUs on the cloud, highlighting the capabilities of scaling AI-based data processing using Hugging Face and Dask.

[Read more](https://huggingface.co/blog/dask-scaling)
