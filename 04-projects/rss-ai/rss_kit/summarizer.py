import os
from typing import Optional
from urllib.parse import urlparse

from openai import OpenAI

from rss_kit.error_handler import RSSAIError, handle_error
from rss_kit.logger import setup_logger

logger = setup_logger("summarizer", "summarizer.log")

client = OpenAI()

CACHE_DIR = "data/output"


def get_cached_summary(article_url: str) -> Optional[str]:
    try:
        cache_file_path = os.path.join(
            CACHE_DIR, f"{article_url.replace('/', '_')}.txt"
        )
        if os.path.exists(cache_file_path):
            with open(cache_file_path, "r") as file:
                return file.read()
        return None
    except Exception as e:
        handle_error(
            e, RSSAIError, f"Error retrieving cached summary for: {article_url}"
        )


def generate_cache_filename(article_url: str) -> str:
    parsed_url = urlparse(article_url)
    domain = parsed_url.netloc.replace(".", "_")
    last_part = parsed_url.path.split("/")[-1].split(".")[0]
    return f"{domain}_{last_part}"


def cache_summary(article_url: str, summary: str) -> None:
    try:
        os.makedirs(CACHE_DIR, exist_ok=True)
        cache_file_path = os.path.join(
            CACHE_DIR, f"{generate_cache_filename(article_url)}.txt"
        )
        with open(cache_file_path, "w") as file:
            file.write(summary)
    except Exception as e:
        handle_error(e, RSSAIError, f"Error caching summary for: {article_url}")


def generate_summary(article_text: str) -> str:
    try:
        prompt = f"""From the long article below, extract the three main points
        of the article below in bullet points.
        Ignore the parts of the text that do not contain the article. 
        Ignore any HTML code snippets you find:
        {article_text}
        """

        role_content = """You are a professional news summarizer. Write in
        easy to understand terms the main ideas of the provided article"""

        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": role_content},
                {"role": "user", "content": prompt},
            ],
            model="gpt-3.5-turbo",
        )
        summary_content = completion.choices[0].message.content
        logger.info(summary_content)
        return summary_content
    except Exception as e:
        handle_error(e, RSSAIError, "Error generating summary")


def summarize_article(article_url: str, article_text: str) -> str:
    try:
        cached_summary = get_cached_summary(article_url)
        if cached_summary:
            logger.info(f"Cached summary found for URL: {article_url}")
            return cached_summary

        summary = generate_summary(article_text)
        cache_summary(article_url, summary)
        return summary
    except Exception as e:
        handle_error(e, RSSAIError, f"Error summarizing article: {article_url}")
