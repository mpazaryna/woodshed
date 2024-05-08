import os

import markdown
import pdfkit


def convert_md_to_pdf(md_path, pdf_path):
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Convert markdown to HTML
    html = markdown.markdown(content)

    # Convert HTML to PDF
    pdfkit.from_string(html, pdf_path)


def main():
    src_dir = "local"
    dest_dir = "converted"

    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)

    for filename in os.listdir(src_dir):
        if filename.endswith(".md"):
            md_path = os.path.join(src_dir, filename)
            pdf_path = os.path.join(dest_dir, filename.replace(".md", ".pdf"))
            convert_md_to_pdf(md_path, pdf_path)
            print(f"Converted {filename} to PDF!")


if __name__ == "__main__":
    main()
