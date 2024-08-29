import json
import time
import urllib.request

import arxiv
import feedparser

# Base API query URL
base_url = "http://export.arxiv.org/api/query?"


def fetch_arxiv_results(search_query, total_results=6, results_per_iteration=2):
    """Fetch results from arXiv API with paging."""
    all_results = []
    for start in range(0, total_results, results_per_iteration):
        query = f"search_query={search_query}&start={start}&max_results={results_per_iteration}"
        response = urllib.request.urlopen(base_url + query).read()
        feed = feedparser.parse(response)

        # Collect results
        for entry in feed.entries:
            all_results.append(
                {
                    "id": entry.id.split("/abs/")[-1],
                    "title": entry.title,
                    "published": entry.published,
                    "summary": entry.summary,
                    "authors": [author.name for author in entry.authors],
                }
            )

        print(
            f"Fetched {len(feed.entries)} results from {start} to {start + results_per_iteration}."
        )
        time.sleep(3)  # Sleep to avoid hitting the API too quickly

    return all_results


def save_results_to_json(results, filename):
    """Save search results to a JSON file."""
    if not results:
        print("No results to save.")
        return

    with open(filename, "w") as f:
        json.dump(results, f, indent=4)
    print(f"Saved {len(results)} results to {filename}")


def download_papers_from_file(file_path):
    with open(file_path, "r") as f:
        ids = f.read().splitlines()

    for arxiv_id in ids:
        paper = next(arxiv.Client().results(arxiv.Search(id_list=[arxiv_id])))
        # Rename the downloaded file to match the arxiv_id
        paper.download_pdf(filename=f"{arxiv_id}.pdf", dirpath="./data")
