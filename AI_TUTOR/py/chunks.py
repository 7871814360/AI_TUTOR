import json
import numpy as np
import faiss
from sklearn.feature_extraction.text import TfidfVectorizer

def load_json(json_file_path):
    with open(json_file_path, 'r') as json_file:
        return json.load(json_file)

def create_chunks(text_data, chunk_size):
    chunks = []
    for key, content in text_data.items():
        words = content.split()
        for i in range(0, len(words), chunk_size):
            chunk = ' '.join(words[i:i + chunk_size])
            chunks.append(chunk)
    return chunks

def compute_embeddings(chunks):
    vectorizer = TfidfVectorizer()
    embeddings = vectorizer.fit_transform(chunks).toarray()
    return embeddings, vectorizer

def find_similar_chunks(embeddings, query_embedding, k=5, similarity_factor=1.0):
    index = faiss.IndexFlatL2(embeddings.shape[1])  # L2 distance
    index.add(embeddings.astype('float32'))  # FAISS requires float32
    distances, indices = index.search(query_embedding.astype('float32'), k)

    # Adjust distances based on similarity factor
    adjusted_distances = distances[0] * similarity_factor
    return indices, adjusted_distances

def main(json_file_path, query, chunk_size, k, similarity_factor):
    # Load JSON data
    text_data = load_json(json_file_path)

    # Create text chunks
    chunks = create_chunks(text_data, chunk_size)

    # Compute embeddings for the chunks
    embeddings, vectorizer = compute_embeddings(chunks)

    # Transform the query into an embedding
    query_embedding = vectorizer.transform([query]).toarray()

    # Find similar chunks
    indices, distances = find_similar_chunks(embeddings, query_embedding, k, similarity_factor)

    # Return the similar chunks and their adjusted distances
    similar_chunks = [(chunks[i], distances[j]) for j, i in enumerate(indices[0])]
    return similar_chunks

# Example usage
json_file_path = 'output.json'  # Path to your JSON file
query = input("Ask a Question?\n")   # Replace with your query
similarity_factor = 0.5          # Decrease similarity (increase threshold)
chunk_size=100
similar_chunks = main(json_file_path, query ,chunk_size, k=3,similarity_factor=similarity_factor)

print("Similar chunks found:")
for chunk, distance in similar_chunks:
    print(f"Chunk: {chunk}\nAdjusted Distance: {distance}\n")