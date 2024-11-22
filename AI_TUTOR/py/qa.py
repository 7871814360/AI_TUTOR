import pandas as pd
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import glob
import os

# Specify the folder containing CSV files
folder_path = './dataset'  # Replace with your folder path

# Load all CSV files in the folder
all_files = glob.glob(os.path.join(folder_path, "*.csv"))

# Concatenate all CSV files into a single DataFrame
df = pd.concat((pd.read_csv(f) for f in all_files), ignore_index=True)

# Load pre-trained model for embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')

# Generate embeddings for each question in the CSV
questions = df['Question'].tolist()
answers = df['Answer'].tolist()
page_numbers = df['PageNo'].tolist()  # Load PageNo column
question_embeddings = model.encode(questions)

# Create FAISS index
d = question_embeddings.shape[1]
index = faiss.IndexFlatL2(d)
index.add(np.array(question_embeddings))

def get_answer(user_question):
    # Generate embedding for user question
    user_embedding = model.encode([user_question])

    # Search for the closest match
    D, I = index.search(np.array(user_embedding), k=1)
    
    # Set a similarity threshold (e.g., 0.75 for exactness)
    threshold = 1
    if D[0][0] < threshold:
        answer = answers[I[0][0]]
        page_no = page_numbers[I[0][0]]  # Get the corresponding page number
        return answer, page_no
    else:
        return None, None  # Return None for both if no match

# Example usage
# user_question = input("Enter your question: ")
# answer, page_no = get_answer(user_question)
# if answer:
#     print(f"Answer: {answer}, Page Number: {page_no}")
# else:
#     print("No relevant answer found.")
