# table_generator.py
import yaml


def generate_markdown_table(data):
    """
    Generate a markdown table from a list of dictionaries.
    Each dictionary should have 'Cookbook', 'Description', and 'Open' keys.
    """
    # Table header
    markdown = "| Cookbook | Description | Open |\n"
    markdown += "|----------|-------------|------|\n"

    # Table rows
    for item in data:
        row = f"| {item['Cookbook']} | {item['Description']} | {item['Open']} |\n"
        markdown += row

    return markdown


def read_yaml_data(yaml_file):
    """Read data from YAML file."""
    with open(yaml_file, "r") as f:
        return yaml.safe_load(f)


def main(yaml_file, output_file="cookbook_table.md"):
    """Main function to read YAML and generate markdown table."""
    try:
        # Read YAML data
        data = read_yaml_data(yaml_file)

        # Generate markdown
        markdown_table = generate_markdown_table(data)

        # Write to file
        with open(output_file, "w") as f:
            f.write(markdown_table)

        print(f"Successfully generated markdown table in {output_file}")

    except FileNotFoundError:
        print(f"Error: Could not find YAML file: {yaml_file}")
    except yaml.YAMLError as e:
        print(f"Error parsing YAML file: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main("cookbooks.yaml")
