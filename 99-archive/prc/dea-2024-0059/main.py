import pandas as pd
from lib import (
    process_dataframe, analyze_sentiment, get_df_size_info,
    compare_dataframes, extract_and_count_keywords, profile_function
)

def write_to_file(filename, content):
    with open(filename, 'w') as f:
        f.write(content)

if __name__ == "__main__":
    
    FILE_PATH= "data/lym-yniq-kanh.csv"
    # FILE_PATH = "../data/lym-yniq-kanh.csv"

    # Read the CSV file
    df = pd.read_csv(FILE_PATH)  # Replace with your actual file name

    # Process the dataframe
    processed_df, process_time = profile_function(process_dataframe, df)
    
    # Analyze sentiment
    (sentiment_dist, avg_sentiment), sentiment_time = profile_function(analyze_sentiment, processed_df)
    
    # Get size information
    original_size_info, original_size_time = profile_function(get_df_size_info, df)
    processed_size_info, processed_size_time = profile_function(get_df_size_info, processed_df)
    
    # Compare dataframes
    size_comparison, comparison_time = profile_function(compare_dataframes, df, processed_df)
    
    # Extract and count keywords
    keyword_counts, keyword_time = profile_function(extract_and_count_keywords, processed_df)

    # Prepare output
    output = f"""
Processed DataFrame Sample:
{processed_df.head().to_string()}

Sentiment Analysis:
Distribution:
{sentiment_dist}
Average Sentiment Score: {avg_sentiment:.2f}

DataFrame Size Information:
Original DataFrame: {original_size_info}
Processed DataFrame: {processed_size_info}

Size Comparison:
{size_comparison}

Top 20 Keywords and their Counts:
{'\n'.join([f"{keyword}: {count}" for keyword, count in keyword_counts[:20]])}

Execution Times:
Process Dataframe: {process_time:.4f} seconds
Analyze Sentiment: {sentiment_time:.4f} seconds
Get Original Size Info: {original_size_time:.4f} seconds
Get Processed Size Info: {processed_size_time:.4f} seconds
Compare Dataframes: {comparison_time:.4f} seconds
Extract and Count Keywords: {keyword_time:.4f} seconds
    """

    # Write output to file
    write_to_file('output/analysis_results.txt', output)

    print("Analysis complete. Results written to analysis_results.txt")