import feedparser

from recipe_assistant.utils import read_file_from_data_directory


def test_feed_parsing():
    # Read the test.json file
    test_data = read_file_from_data_directory("test.json")

    # Verify that the file contains RSS feeds
    assert "rss_feeds" in test_data, "test.json should contain 'rss_feeds' key"
    assert isinstance(test_data["rss_feeds"], list), "'rss_feeds' should be a list"
    assert len(test_data["rss_feeds"]) > 0, "There should be at least one RSS feed"

    # Attempt to parse each feed
    for feed in test_data["rss_feeds"]:
        assert "url" in feed, "Each feed should have a 'url' key"

        # Parse the feed using feedparser
        parsed_feed = feedparser.parse(feed["url"])

        # Check if the feed was successfully parsed
        assert parsed_feed.get("bozo") == 0, f"Failed to parse feed: {feed['url']}"

        # Verify that the feed has entries
        assert "entries" in parsed_feed, f"No entries found in feed: {feed['url']}"
        assert len(parsed_feed.entries) > 0, f"Feed has no entries: {feed['url']}"

        # Check for basic feed elements
        assert "title" in parsed_feed.feed, f"Feed has no title: {feed['url']}"
        assert "link" in parsed_feed.feed, f"Feed has no link: {feed['url']}"

        # Check the first entry for common elements
        first_entry = parsed_feed.entries[0]
        assert "title" in first_entry, f"First entry has no title: {feed['url']}"
        assert "link" in first_entry, f"First entry has no link: {feed['url']}"


def test_rss_feed_titles():
    # Read the XML file using file_operations
    xml_content = read_file_from_data_directory("101cookbooks.xml")

    # Parse the XML content using feedparser
    feed = feedparser.parse(xml_content)

    # Extract titles from the feed
    titles = [entry.title for entry in feed.entries]

    # Assert that we have some titles
    assert len(titles) > 0, "No titles found in the RSS feed"

    # Check for specific titles (you can adjust these based on the actual content)
    expected_titles = [
        "Fluffy Pancakes",
        "Feel-good Lunch Ideas",
        "Zucchini Soup",
        "Berry Pie",
        "Lemon Gigante Beans",
    ]

    for title in expected_titles:
        assert title in titles, f"Expected title '{title}' not found in the RSS feed"

    # Print all titles for reference
    print("All titles in the RSS feed:")
    for title in titles:
        print(f"- {title}")
