import os

import requests

# Ensure the 'pdf' directory exists
if not os.path.exists("pdf"):
    os.makedirs("pdf")

# Open the file and read the URLs
with open("pdf.txt", "r") as file:
    urls = file.readlines()

# Download each PDF
for url in urls:
    url = url.strip()  # Remove any whitespace

    # Use the URL to derive a filename
    filename = url.split("/")[-1]

    if not filename.endswith(".pdf"):
        filename += ".pdf"

    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(f"pdf/{filename}", "wb") as pdf_file:
            for chunk in response.iter_content(chunk_size=8192):
                pdf_file.write(chunk)
    else:
        print(f"Failed to download {url}. Status code: {response.status_code}")

print("Download complete!")
