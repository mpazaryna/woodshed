import os
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup


def ensure_directory(folder_name):
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)


def get_internal_links(site):
    root_url = site["root_url"]
    folder_name = site["folder_name"]
    ensure_directory(folder_name)

    internal_links = set()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }

    try:
        response = requests.get(root_url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, "html.parser")

        for link in soup.find_all("a", href=True):
            href = link["href"]
            joined_url = urljoin(root_url, href)
            parsed_url = urlparse(joined_url)

            if parsed_url.netloc == urlparse(root_url).netloc:
                internal_links.add(joined_url)

    except requests.RequestException as e:
        print(f"An error occurred: {e}")

    with open(f"{folder_name}/internal_links.txt", "w") as file:
        for link in internal_links:
            file.write(f"{link}\n")

    return list(internal_links)


def scrape_to_markdown(site, urls):
    folder_name = site["folder_name"]
    ensure_directory(folder_name)
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }

    for url in urls:
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, "html.parser")
            title = soup.find("title").text.strip()
            paragraphs = soup.find_all("p")
            content = "\n".join(p.get_text().strip() for p in paragraphs)

            markdown_content = f"# {title}\n\n{content}"
            output_file = f"{folder_name}/{url.rstrip('/').split('/')[-1]}.md"

            with open(output_file, "w") as file:
                file.write(markdown_content)
            print(f"Markdown file '{output_file}' created successfully.")
        except Exception as e:
            print(f"An error occurred for URL '{url}': {e}")


def main(sites=None):
    if sites is None:
        sites = [
            {"root_url": "https://pcare.com/", "folder_name": "data/raw/pcare"},
            {"root_url": "https://www.hci-tv.com/", "folder_name": "data/raw/hci-tv"},
            {"root_url": "https://www.sonifi.com/", "folder_name": "data/raw/sonifi"},
            {"root_url": "https://www.evideon.com/", "folder_name": "data/raw/evideon"},
            # Add more sites as needed
        ]
    for site in sites:
        internal_links = get_internal_links(site)
        scrape_to_markdown(site, internal_links)


if __name__ == "__main__":
    main()
