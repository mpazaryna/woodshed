import os
import time
from urllib.parse import urljoin, urlparse

import html2text
import requests
from bs4 import BeautifulSoup

MAX_RETRIES = 5  # Adjust this as needed
DELAY = 5  # Start with a 5 second delay and adjust as needed


def download_file(url, folder):
    """Downloads a file from a URL and saves it to a folder."""
    local_filename = os.path.join(folder, url.split("/")[-1])
    with requests.get(
        url, stream=True, headers={"User-Agent": "Mozilla/5.0"}
    ) as response:
        response.raise_for_status()
        with open(local_filename, "wb") as file:
            for chunk in response.iter_content(chunk_size=8192):
                file.write(chunk)
    return local_filename


def get_file_name_from_url(url):
    """Extract the last part of the URL to use as filename."""
    parsed_url = urlparse(url)
    base_name = os.path.basename(parsed_url.path)
    if not base_name:
        base_name = parsed_url.netloc
    return base_name


def fetch_url(url):
    """Fetch a URL with retries and delay for handling rate limits."""
    retries = 0
    while retries < MAX_RETRIES:
        try:
            response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
            response.raise_for_status()  # Will raise an HTTPError if an error code.
            return response
        except requests.HTTPError as e:
            if e.response.status_code == 429:
                print("Rate limit reached. Waiting and retrying...")
                time.sleep(DELAY * (retries + 1))  # Increasing delay with more retries
                retries += 1
                continue
            else:
                raise
    raise Exception("Failed to fetch after multiple retries.")


def main():
    # Ensure downloads folder exists
    if not os.path.exists("downloads"):
        os.makedirs("downloads")

    # Read URLs
    with open("download.txt", "r") as f:
        urls = [url.strip() for url in f.readlines()]

    converter = html2text.HTML2Text()
    converter.ignore_links = False

    for url in urls:
        print(f"Fetching {url}")

        response = fetch_url(url)

        soup = BeautifulSoup(response.content, "html.parser")

        # Extract content within <div id="page-body">
        page_body = soup.find("div", id="page-body")

        if not page_body:
            print(f"No <div id='page-body'> found in {url}. Skipping...")
            continue

        # Convert the page body's HTML to markdown
        markdown_content = converter.handle(str(page_body))

        # Save markdown to local file using the last part of the URL
        file_name = get_file_name_from_url(url)
        local_markdown_file = os.path.join("downloads", f"{file_name}.md")
        with open(local_markdown_file, "w", encoding="utf-8") as file:
            file.write(markdown_content)

        # Create a directory for the resources of this webpage
        resources_folder = os.path.join("downloads", file_name)
        if not os.path.exists(resources_folder):
            os.makedirs(resources_folder)

        # Identify and download resources like images from page_body
        resource_tags = page_body.find_all("img")
        for tag in resource_tags:
            resource_url = tag.get("src") if tag.name == "img" else None

            if resource_url:
                absolute_url = urljoin(url, resource_url)
                try:
                    download_file(absolute_url, resources_folder)
                except Exception as e:
                    print(f"Failed to download {absolute_url}. Reason: {e}")


if __name__ == "__main__":
    main()
