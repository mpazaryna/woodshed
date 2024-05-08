from groq import Groq
import os

def write_to_file(model_name, completion_content):
    # Get the current working directory
    current_dir = os.getcwd()

    subdirectory = "completions"

    # Create a directory named after the model
    os.makedirs(os.path.join(current_dir, subdirectory), exist_ok=True)

    # write the completion to a file named after the model
    with open(os.path.join(current_dir, subdirectory, f"{model_name}.txt"), "w") as file:
        file.write(f"# Model: {model_name}\n")
        file.write(completion_content + "\n")



def get_chat_completion():
    # Read the model names from the text file
    with open("models.txt", "r") as file:
        models = [line.strip() for line in file]

    # The question to ask
    content = "What is yoga"

    # Initialize Groq client
    client = Groq()

    # Iterate through the models
    for model_name in models:
        try:
            # Create chat completion
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": content,
                    }
                ],
                model=model_name,
            )

            # Get the content of the first choice
            completion_content = chat_completion.choices[0].message.content

            # Print the completion to the terminal
            print(completion_content)

            # Call the function to write the data to a file
            write_to_file(model_name, completion_content)
        except Exception as e:
            print(f"An error occurred while getting chat completion for model {model_name}: {e}")

# Usage
if __name__ == "__main__":
    get_chat_completion()