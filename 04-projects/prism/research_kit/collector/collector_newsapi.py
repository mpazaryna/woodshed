import requests

API_KEY = "insert_key_here"
COMPANY = "Mount Vernon Mills, Inc."
URL = f"https://newsapi.org/v2/everything?q={COMPANY}&apiKey={API_KEY}"

response = requests.get(URL)
news_data = response.json()

for article in news_data["articles"]:
    print(f"Title: {article['title']}")
    print(f"Source: {article['source']['name']}")
    print(f"Description: {article['description']}")
    print(f"URL: {article['url']}\n")
