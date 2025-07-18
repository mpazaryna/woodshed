import os

from research_kit.collector.collector_perplexity import get_perplexity_response
from research_kit.reporting import generate_perplexity_section


def test_generate_perplexity_section_with_actual_data():
    # Define the inputs
    # query = "Apple"
    # company_domain = "apple.com"

    query = "Provide as much information as possible about Cotswold Industries"
    company_domain = "cotswoldindustries.com"

    # Get the actual data using get_perplexity_response
    try:
        perplexity_data = get_perplexity_response(query, company_domain)
    except Exception as e:
        print(f"Failed to get perplexity response: {e}")
        return

    # Generate the perplexity section using the actual data
    perplexity_section = generate_perplexity_section(perplexity_data)

    # Define the output file path
    reports_folder = "reports"
    os.makedirs(reports_folder, exist_ok=True)
    output_file_path = os.path.join(reports_folder, f"{query}_perplexity_report.txt")

    # Write the report section to a file
    with open(output_file_path, "w") as file:
        file.write(f"Title: {perplexity_section['title']}\n")
        file.write(f"Content: {perplexity_section['content']}\n")
