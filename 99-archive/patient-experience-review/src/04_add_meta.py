import os


def add_meta_information(folder_path):
    """Adds meta information to text files based on their filename prefix"""
    for filename in os.listdir(folder_path):
        if filename.endswith(".txt"):
            meta_info = ""
            if filename.startswith("evideon-"):
                meta_info = "Evideon Knowledge Base Article\n\n"
            if filename.startswith("hci-"):
                meta_info = "HCI Knowledge Base Article\n\n"
            if filename.startswith("sonifi-"):
                meta_info = "SONIFI Knowledge Base Article\n\n"
            elif filename.startswith("pcare-"):
                meta_info = "pCare Knowledge Base Article\n\n"

            if meta_info:
                file_path = os.path.join(folder_path, filename)
                with open(file_path, "r", encoding="utf-8") as file:
                    content = file.read()
                with open(file_path, "w", encoding="utf-8") as file:
                    file.write(meta_info + content)


# Specify your folder path here
folder_path = "data/txt"
add_meta_information(folder_path)
