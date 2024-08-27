from poem_generator import generate_poem

def cli():
    topic = input("Enter a topic for your poem: ")
    poem_type = input("Choose the type of poem (haiku or limerick): ")
    poem_lines = generate_poem(topic, poem_type)
    for line in poem_lines:
        print(line)

if __name__ == "__main__":
    cli()