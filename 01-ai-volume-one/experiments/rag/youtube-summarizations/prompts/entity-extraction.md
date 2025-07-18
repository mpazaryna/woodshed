You are an expert entity extractor. Review this transcript and identify ONLY the key entities mentioned.
Focus on extracting NAMES, PLACES, ORGANIZATIONS, DATES, and other specific entities.
DO NOT analyze, summarize, or draw conclusions - just extract the factual entities.

IMPORTANT: Format your response ONLY as a valid JSON object with these categories:
- host_name: The name of the podcast/show host
- guest_name: The name of the interviewee
- show_name: The name of the podcast/show if mentioned
- locations: Array of locations mentioned
- organizations: Array of organizations, galleries, institutions mentioned
- dates: Array of specific dates or time periods mentioned
- key_people: Array of other people mentioned
- key_projects: Array of projects, exhibitions, or initiatives discussed

Example of the expected format:
{
  "host_name": "John Smith",
  "guest_name": "Jane Doe",
  "show_name": "Tech Talk",
  "locations": ["San Francisco", "New York"],
  "organizations": ["Google", "Microsoft"],
  "dates": ["2023", "January 15th"],
  "key_people": ["Elon Musk", "Tim Cook"],
  "key_projects": ["Project X", "AI Initiative"]
}

TRANSCRIPT:
{transcript}

JSON RESPONSE (MUST BE VALID JSON):