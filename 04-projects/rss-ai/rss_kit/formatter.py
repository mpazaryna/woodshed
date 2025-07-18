def format_summary(article_data: dict, summary: str) -> str:
    """
    Format the article summary and metadata into a consistent Markdown output.

    Args:
        article_data (dict): A dictionary containing article metadata (title, source, date, url).
        summary (str): The AI-generated summary of the article.

    Returns:
        str: Formatted summary in Markdown.
    """
    title = article_data.get("title", "No title available")
    source = article_data.get("source", "Unknown source")
    date = article_data.get("date", "No date available")
    url = article_data.get("url", "#")

    formatted_output = f"""# {title}

**Source**: {source}
**Date**: {date}

{summary}

[Read more]({url})
"""
    return formatted_output
