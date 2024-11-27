from fastapi import FastAPI, HTTPException
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from pydantic import BaseModel
import os
from rag_config import EMBEDDING_MODEL, DATA_FILE_PATH, FAISS_INDEX_PATH

app = FastAPI()

embedding_model = SentenceTransformer(EMBEDDING_MODEL)

# FAISS index and data storage
faiss_index = None
contexts = [] 


class Query(BaseModel):
    query: str

# laod and preprocess the data
def load_data():
    if not os.path.exists(DATA_FILE_PATH):
        raise FileNotFoundError(f"Data file not found at {DATA_FILE_PATH}")
    with open(DATA_FILE_PATH, 'r', encoding='utf-8') as file:
        data = file.read()
    return [context.strip() for context in data.split("\n\n") if context.strip()]

#embed and index the data
def embed_and_index(data):
    global faiss_index, contexts
    contexts = data
    embeddings = embedding_model.encode(data)

    # Create and populate FAISS index
    dimension = embeddings.shape[1]
    faiss_index = faiss.IndexFlatL2(dimension)
    faiss_index.add(embeddings)

    # save the index to disk
    faiss.write_index(faiss_index, FAISS_INDEX_PATH)

# Rerank the results
def rerank_results(query, candidates):
    query_embedding = embedding_model.encode([query])
    candidate_embeddings = embedding_model.encode(candidates)

    # Compute cosine similarity
    query_embedding = query_embedding / np.linalg.norm(query_embedding, axis=1, keepdims=True)
    candidate_embeddings = candidate_embeddings / np.linalg.norm(candidate_embeddings, axis=1, keepdims=True)
    scores = np.dot(candidate_embeddings, query_embedding.T).squeeze()

    # Sort candidates by scores
    ranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)
    return [r[0] for r in ranked]

# Initialize the API
@app.on_event("startup")
def initialize():
    global faiss_index, contexts
    try:
        # Load data
        contexts = load_data()
        if not contexts:
            raise ValueError(f"No contexts found in {DATA_FILE_PATH}")

        # Load or create FAISS index
        if os.path.exists(FAISS_INDEX_PATH):
            faiss_index = faiss.read_index(FAISS_INDEX_PATH)
            print(f"FAISS index loaded from {FAISS_INDEX_PATH}")
        else:
            print("Embedding and indexing data...")
            embed_and_index(contexts)
            print(f"Data successfully embedded and indexed in {FAISS_INDEX_PATH}")
    except Exception as e:
        print(f"Initialization error: {e}")
        raise e

# API endpoint to process queries
@app.post("/query")
def process_query(query: Query):
    global faiss_index, contexts

    if not faiss_index or not contexts:
        raise HTTPException(status_code=500, detail="FAISS index or contexts not initialized.")

    # embed user query
    query_embedding = embedding_model.encode([query.query])

    # Retrieve top-N matches
    top_n = 5
    distances, indices = faiss_index.search(query_embedding, top_n)
    top_matches = [contexts[idx] for idx in indices[0] if idx != -1]

    if not top_matches:
        raise HTTPException(status_code=404, detail="No matching context found.")

    # rerank results
    reranked_results = rerank_results(query.query, top_matches)

    # Select the best match
    best_match = reranked_results[0] if reranked_results else None

    return {
        "query": query.query,
        "context": best_match
    } 