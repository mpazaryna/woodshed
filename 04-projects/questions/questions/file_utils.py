import json
import logging
from datetime import datetime
from typing import Dict, List

from .config import ConfigTuple


def save_results(
    config: ConfigTuple, original_question: str, results: List[Dict], timestamp: str
):
    """Save results to both JSON and Markdown files."""
    base_name = f"questions_{timestamp}"
    json_path = config.output_dir / f"{base_name}.json"
    md_path = config.output_dir / f"{base_name}.md"

    output = {
        "original_question": original_question,
        "timestamp": timestamp,
        "results": results,
    }

    # Ensure output directory exists
    config.output_dir.mkdir(parents=True, exist_ok=True)

    # Save JSON
    with open(json_path, "w") as f:
        json.dump(output, f, indent=2)

    # Save Markdown
    with open(md_path, "w") as f:
        f.write("# Q&A Results\n\n")
        f.write(f"*Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n")
        f.write(f"## Original Question\n\n{original_question}\n\n")
        f.write("## Detailed Analysis\n\n")

        for i, result in enumerate(results, 1):
            f.write(f"### Question {i}\n\n")
            f.write(f"**Q:** {result['question']}\n\n")
            f.write(f"**A:** {result['answer']}\n\n")
            if i < len(results):
                f.write("---\n\n")

    logging.info("\nResults saved to:")
    logging.info(f"- JSON: {json_path}")
    logging.info(f"- Markdown: {md_path}")
