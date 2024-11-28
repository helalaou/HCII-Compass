from fastapi import FastAPI, HTTPException
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer, util
from pydantic import BaseModel
import os
from rag_config import EMBEDDING_MODEL, DATA_FILE_PATH, FAISS_INDEX_PATH
import logging
from logging.handlers import RotatingFileHandler

app = FastAPI()

embedding_model = SentenceTransformer(EMBEDDING_MODEL)

# Configure logging
logger = logging.getLogger('rag_server')
logger.setLevel(logging.INFO)

# Create a rotating file handler
handler = RotatingFileHandler('logs/logs.txt', maxBytes=1024*1024, backupCount=5, mode='a')
handler.setLevel(logging.INFO)

# Create a formatter and add it to the handler
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)

# Add the handler to the logger
logger.addHandler(handler)

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
    logger.info(f"Embedding {len(data)} contexts...")
    embeddings = embedding_model.encode(data)
    logger.info(f"Embeddings shape: {embeddings.shape}")

    # Create and populate FAISS index
    dimension = embeddings.shape[1]
    faiss_index = faiss.IndexFlatL2(dimension)
    faiss_index.add(embeddings)
    logger.info(f"FAISS index created with {faiss_index.ntotal} entries")

    # save the index to disk
    faiss.write_index(faiss_index, FAISS_INDEX_PATH)
    logger.info(f"FAISS index saved to {FAISS_INDEX_PATH}")

# Rerank the results using SentenceTransformer
def rerank_results(query, candidates):
    logger.info(f"Reranking {len(candidates)} candidates...")
    
    # Encode query and candidates
    query_embedding = embedding_model.encode([query])
    candidate_embeddings = embedding_model.encode(candidates)

    # Compute cosine similarity scores
    scores = util.cos_sim(query_embedding, candidate_embeddings).squeeze()

    # Sort candidates by scores
    ranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)
    
    logger.info("Reranked candidates:")
    for i, (candidate, score) in enumerate(ranked, start=1):
        logger.info(f"{i}. Score: {score:.4f}, Text: {candidate[:100]}...")
        
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
            logger.info(f"FAISS index loaded from {FAISS_INDEX_PATH}")
        else:
            logger.info("Embedding and indexing data...")
            embed_and_index(contexts)
            logger.info(f"Data successfully embedded and indexed in {FAISS_INDEX_PATH}")
    except Exception as e:
        logger.error(f"Initialization error: {e}")
        raise e

# API endpoint to process queries
@app.post("/query")
def process_query(query: Query):
    global faiss_index, contexts

    if not faiss_index or not contexts:
        raise HTTPException(status_code=500, detail="FAISS index or contexts not initialized.")

    logger.info(f"Processing query: {query.query}")
    
    # embed user query
    query_embedding = embedding_model.encode([query.query])

    # Retrieve top-N matches
    top_n = 5
    logger.info(f"Retrieving top {top_n} matches from FAISS index...")
    distances, indices = faiss_index.search(query_embedding, top_n)
    
    logger.info(f"Top {top_n} matches:")
    for i, (idx, dist) in enumerate(zip(indices[0], distances[0]), start=1):
        if idx != -1:
            logger.info(f"{i}. Distance: {dist:.4f}, Text: {contexts[idx][:100]}...")
        
    top_matches = [contexts[idx] for idx in indices[0] if idx != -1]

    if not top_matches:
        raise HTTPException(status_code=404, detail="No matching context found.")

    # rerank results
    reranked_results = rerank_results(query.query, top_matches)

    # Select the best match
    best_match = reranked_results[0] if reranked_results else None

    logger.info(f"Best matching context: {best_match[:100]}...")
    
    return {
        "query": query.query,
        "context": best_match
    } 