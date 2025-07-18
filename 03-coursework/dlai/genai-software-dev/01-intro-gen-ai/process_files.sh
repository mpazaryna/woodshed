#!/bin/bash

# Directory containing the input files
INPUT_DIR="data/transcripts/week-02"

# Directory for output files
OUTPUT_DIR="data/extractions/week-02"

# Create the output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Loop through all text files in the input directory
for file in "$INPUT_DIR"/*.txt
do
    # Get the filename without the path and extension
    filename=$(basename "$file" .txt)
    
    # Console message indicating which file is being processed
    echo "Processing file: $filename.txt"
    
    # Run the fabric command on each file
    cat "$file" | fabric --pattern summarize_paper > "$OUTPUT_DIR/${filename}-summarize-paper.md"
    
    # Console message indicating the file has been processed
    echo "Finished processing: $filename.txt"
    echo "Output written to: $OUTPUT_DIR/${filename}-summarize-paper.md"
    echo "-----------------------------------"
done

echo "All files have been processed."