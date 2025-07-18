# Improving Parquet Dedupe on Hugging Face Hub

**Source**: HuggingFace
**Date**: time.struct_time(tm_year=2024, tm_mon=10, tm_mday=5, tm_hour=0, tm_min=0, tm_sec=0, tm_wday=5, tm_yday=279, tm_isdst=0)

- The Xet team at Hugging Face is working to improve the efficiency of the Hub's storage architecture, particularly focusing on Parquet file optimization for datasets and models, as Hugging Face holds a significant amount of data.
- Deduplication is crucial for optimizing storage space when updating datasets regularly, enabling the storage of multiple versions compactly without re-uploading everything.
- Through experiments on Parquet files, modifications like appends dedupe efficiently, but row modifications and deletions pose challenges due to Parquet column headers' layout, leading to potential solutions like using content-defined row groups for better deduplication and exploring ways to improve Parquet file dedupe-ability.

[Read more](https://huggingface.co/blog/improve_parquet_dedupe)
