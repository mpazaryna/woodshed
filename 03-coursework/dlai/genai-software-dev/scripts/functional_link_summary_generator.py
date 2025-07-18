#!/usr/bin/env python3

import sys
from pathlib import Path
from typing import Dict, List, Tuple

import yaml


def load_config(config_path: str) -> dict:
    """
    Load and validate YAML configuration
    Args:
        config_path: Path to config YAML file
    Returns:
        Dict containing validated configuration
    """
    try:
        with open(config_path, "r") as f:
            config = yaml.safe_load(f)

        # Get project root (same directory as config.yaml)
        project_root = Path(config_path).parent
        config["module_path"] = str(project_root / config["module_path"])
        return config

    except Exception as e:
        print(f"Error loading config: {e}")
        sys.exit(1)


def find_summary_files(module_path: Path, module_name: str) -> List[Path]:
    """
    Find all markdown summary files in the module's summaries directory
    Args:
        module_path: Path to module directory
        module_name: Name of module being processed
    Returns:
        List of paths to markdown files
    """
    summaries_path = module_path / "transcripts" / "summaries"
    if not summaries_path.exists():
        print(f"Summaries directory not found: {summaries_path}")
        return []

    summary_files = sorted(summaries_path.rglob("*.md"))
    print(f"Found {len(summary_files)} summary files in {module_name}")
    return summary_files


def organize_files_by_week(
    files: List[Path], base_path: Path
) -> Dict[str, List[Tuple[str, Path]]]:
    """
    Organize summary files by their parent directory
    Args:
        files: List of file paths to organize
        base_path: Base path for creating relative links
    Returns:
        Dict mapping section names to lists of (title, path) tuples
    """
    organized: Dict[str, List[Tuple[str, Path]]] = {}

    for file_path in files:
        # Get parent directory name (module-XX)
        section = file_path.parent.name

        # Create readable title from filename
        title = file_path.stem.replace("-", " ").replace("_", " ").title()

        # Create relative path from module root
        relative_path = file_path.relative_to(base_path)

        if section not in organized:
            organized[section] = []
        organized[section].append((title, relative_path))

    return organized


def generate_markdown_content(
    organized_files: Dict[str, List[Tuple[str, Path]]]
) -> str:
    """
    Generate markdown content for the README
    Args:
        organized_files: Dict of organized file information
    Returns:
        Formatted markdown string
    """
    content = []

    for section in sorted(organized_files.keys()):
        # Add section header
        if section.startswith("module-"):
            content.append(f"\n### {section.replace('-', ' ').title()}\n")

        # Add files within this section
        for title, path in sorted(organized_files[section]):
            content.append(f"- [{title}]({path})")

    return "\n".join(content)


def update_readme(readme_path: Path, new_content: str) -> None:
    """
    Update or create README with new summary content
    Args:
        readme_path: Path to README file
        new_content: New markdown content to add
    """
    start_marker = "<!-- BEGIN SUMMARIES -->\n"
    end_marker = "<!-- END SUMMARIES -->\n"
    summaries_header = "## Lecture Summaries\n\n"

    try:
        # Read existing content or create new
        if readme_path.exists():
            with open(readme_path, "r", encoding="utf-8") as f:
                current_content = f.read()
        else:
            current_content = "# Course Module\n\n"

        # Create new summary section
        new_section = (
            summaries_header + start_marker + new_content + "\n\n" + end_marker
        )

        # Replace existing section or append new one
        if start_marker in current_content:
            start_idx = current_content.find(start_marker) - len(summaries_header)
            end_idx = current_content.find(end_marker) + len(end_marker)
            final_content = (
                current_content[:start_idx] + new_section + current_content[end_idx:]
            )
        else:
            final_content = current_content.rstrip() + "\n\n" + new_section

        # Write updated content
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(final_content)

        print(f"Successfully updated {readme_path}")

    except Exception as e:
        print(f"Error updating README: {e}")
        sys.exit(1)


def main():
    if len(sys.argv) != 2:
        print("Usage: python scripts/functional_link_summary_generator.py config.yaml")
        sys.exit(1)

    # Load configuration
    config = load_config(sys.argv[1])

    # Setup paths
    module_name = config["module"]
    module_path = Path(config["module_path"])
    readme_path = module_path / config["readme_path"]

    print(f"Processing module: {module_name}")
    print(f"Module path: {module_path}")

    # Find and process files
    summary_files = find_summary_files(module_path, module_name)
    if not summary_files:
        print("No summary files found")
        sys.exit(1)

    # Organize files and generate content
    organized_files = organize_files_by_week(summary_files, module_path)
    markdown_content = generate_markdown_content(organized_files)

    # Update README
    update_readme(readme_path, markdown_content)


if __name__ == "__main__":
    main()
