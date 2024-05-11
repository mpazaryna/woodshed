# Retrieval Augmented Generation

Documents are loaded for a given topic, fed into an encoder and turned into vectors.
The vectors are the stored efficiently into a vector database.  The user will 
query the vector database and retrieve similar vectors.  Those will then be 
sent to the LLM (model) for response generation.

