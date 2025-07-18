import os
from pathlib import Path


def generate_summary_links(
    root_dir=".", summaries_dir="transcripts/summaries", readme_path="README.md"
):
    """
    Generate markdown links for summary files and update README.md,
    including files in subdirectories

    Parameters:
    root_dir (str): Root directory of the repository
    summaries_dir (str): Path to summaries directory relative to root
    readme_path (str): Path to README file relative to root
    """
    try:
        # Convert paths to absolute
        root_path = Path(root_dir).resolve()
        summaries_path = root_path / summaries_dir
        readme_full_path = root_path / readme_path

        if not summaries_path.exists():
            raise FileNotFoundError(f"Summaries directory not found: {summaries_path}")

        # Get all summary files recursively
        summary_files = sorted([f for f in summaries_path.rglob("*.md")])

        if not summary_files:
            print("No summary files found")
            return

        # Organize files by subdirectory
        file_structure = {}
        for file_path in summary_files:
            # Get relative path from summaries directory
            rel_to_summaries = file_path.relative_to(summaries_path)
            # Get subdirectory path (empty string if in root of summaries)
            subdir = str(rel_to_summaries.parent)
            if subdir == ".":
                subdir = ""

            if subdir not in file_structure:
                file_structure[subdir] = []
            file_structure[subdir].append(file_path)

        # Generate markdown links organized by subdirectory
        summary_links = []
        for subdir, files in sorted(file_structure.items()):
            if subdir:  # Add subdirectory header if not in root
                # Create readable subdirectory name
                subdir_title = (
                    subdir.replace("_", " ")
                    .replace("-", " ")
                    .replace("/", " - ")
                    .title()
                )
                summary_links.append(f"\n### {subdir_title}\n")

            # Add files in this subdirectory
            for file_path in sorted(files):
                relative_path = file_path.relative_to(root_path)
                file_name = file_path.stem
                # Create a readable title from filename
                title = file_name.replace("_", " ").replace("-", " ").title()
                summary_links.append(f"- [{title}]({relative_path})")

        # Read existing README content
        if readme_full_path.exists():
            with open(readme_full_path, "r") as f:
                readme_content = f.read()
        else:
            readme_content = "# Course Summaries\n\n"

        # Check if summaries section already exists
        summaries_header = "## Lecture Summaries\n\n"
        start_marker = "<!-- BEGIN SUMMARIES -->\n"
        end_marker = "<!-- END SUMMARIES -->\n"

        if start_marker in readme_content:
            # Update existing summaries section
            start_idx = readme_content.find(start_marker) + len(start_marker)
            end_idx = readme_content.find(end_marker)
            new_content = (
                readme_content[:start_idx]
                + "\n".join(summary_links)
                + "\n\n"
                + readme_content[end_idx:]
            )
        else:
            # Add new summaries section
            new_content = (
                readme_content.rstrip()
                + "\n\n"
                + summaries_header
                + start_marker
                + "\n".join(summary_links)
                + "\n\n"
                + end_marker
            )

        # Write updated README
        with open(readme_full_path, "w") as f:
            f.write(new_content)

        print(
            f"Successfully updated {readme_path} with {len(summary_files)} summary links from {len(file_structure)} directories"
        )

    except Exception as e:
        print(f"Error: {str(e)}")


if __name__ == "__main__":
    generate_summary_links()
