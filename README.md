# HCII Compass

HCII Compass is a chatbot designed for students in the Human-Computer Interaction Institute (HCII) within the School of Computer Science (SCS) at Carnegie Mellon University (CMU). It simplifies access to campus and academic information by organizing scattered resources—handbooks, health services, financial policies, event calendars, and more—into easily searchable datasets. Using techniques like Retrieval-Augmented Generation (RAG) and FAISS for vector similarity search, the system employs multiple language models through Ollama and Sentence Transformers for handling chat, embedding, reranking, and more.
![HCII Compass Screenshot](https://i.ibb.co/hWj3yWd/Screenshot-2024-11-28-at-2-32-10-AM.png)

# External Code Use
HCII Compass was built from scratch, using industry-standard tools and libraries to support its functionality. These include Node.js and React for the server and client applications, FastAPI for the backend API, FAISS for vector similarity search, Sentence Transformers for embeddings and reranking, and Ollama for language model integration. All other code, including system architecture, chatbot logic, and UI, was custom-developed for this project.


## Project Structure

The project consists of a client-side React application and a server-side Node.js application that communicates with a FastAPI server for FAISS (Facebook AI Similarity Search) indexing and retrieval.

- `client/`: Contains the React application code.
- `server/`: Contains the Node.js server code and the FastAPI server for FAISS.

## Configuration

The project uses configuration files to manage various settings:

- `client/src/config.js`: Configuration for the client-side application.
  - `serverUrl`: The URL of the Node.js server that the client communicates with.
  - `app`: Object containing the application name and version.
  - `llm`: Object containing the timeout value for the language model requests.

- `server/config.js`: Configuration for the Node.js server.
  - `server`: Object containing the server port, Ollama API URL, and FAISS API URL.
  - `client`: Object containing the client port.
  - `llm`: Object containing the language model name and timeout value.
  - `app`: Object containing the application name and version.

- `server/rag_config.py`: Configuration for the FastAPI server and FAISS.
  - `DATA_FILE_PATH`: Path to the text file containing the data to be indexed.
  - `EMBEDDING_MODEL`: Name of the sentence transformer model to be used for embedding the data.
  - `USE_RERANKER`: Boolean flag to enable or disable the reranker.
  - `RERANKING_MODEL`: Name of the sentence transformer model to be used for reranking the retrieved context (if enabled).
  - `FAISS_INDEX_PATH`: Path to save the FAISS index file.
  - `NUM_RESULTS`: Number of top results to retrieve from the FAISS index.

Make sure to review and update these configuration files as needed, especially for setting the correct ports, paths, and model names. The client configuration file (`client/src/config.js`) allows you to specify the server URL that the client should communicate with, as well as application-specific settings like the name, version, and language model timeout. The server configuration file (`server/config.js`) allows you to configure the server port, API URLs, language model settings, and application details.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/helalaou/HCII-Compass.git
   cd HCII-Compass
   ```

2. Make the `install.sh` and `run.sh` scripts executable (for Unix-based systems (Linux, macOS) only):
     ```
     chmod +x install.sh
     chmod +x run.sh
     ```
3. Run the `install.sh` script to install dependencies for the client, server, and set up the Python virtual environment:
   ```
   ./install.sh
   ```

   This script will:
   - Install dependencies for the client using `npm install`
   - Install dependencies for the server using `npm install`
   - Create a Python virtual environment (if not already created)
   - Activate the virtual environment
   - Install the required Python dependencies

## Running the Application

To start all components of the application, run the `run.sh` script from the project root directory:

```
./run.sh
```

This script will:
   - Create and activate a Python virtual environment (if not already created)
   - Install the required Python dependencies
   - Start the FastAPI server for FAISS
   - Start the Node.js server
   - Start the React application

The application will be accessible at `http://localhost:3000`.

To stop the application, press `[ENTER]` in the terminal where the `run.sh` script is running.

## Server Components

### Node.js Server

The Node.js server (`server/server.js`) acts as an intermediary between the client application and the FastAPI server. It handles requests for generating responses using a language model via Ollama and communicates with the FastAPI server for FAISS indexing and retrieval.

### Ollama

The Node.js server uses Ollama for calling an LLM to generate responses based on a prompt containing the system prompt,user query, chat history, and RAG context. The default model used in this project is `llama3.2:3b-instruct-fp16`, which is a 3 billion parameter model fine-tuned for instruction following. The choice of the Ollama model can be configured in the `server/config.js` file by modifying the `llm.model` variable.

### FastAPI Server

The FastAPI server (`server/rag_server.py`) is responsible for indexing and retrieving data using FAISS. It loads the data from a text file (`server/data/data.txt`), embeds the data using a sentence transformer model, and creates a FAISS index. The server exposes an API endpoint (`/query`) for retrieving the most relevant context based on a given query.

### Embedder

The embedder (`server/rag_server.py`) is responsible for converting text data into vector representations using a pre-trained sentence transformer model. The choice of the sentence transformer model can be configured in the `rag_config.py` file by modifying the `EMBEDDING_MODEL` variable. The default model used is `'all-MiniLM-L6-v2'`.

### Reranker

The reranker (`server/rag_server.py`) is an optional component that can be used to rerank the retrieved context based on their relevance to the query. It uses a pre-trained sentence transformer model to score the retrieved context and select the most relevant ones. The choice of the reranking model can be configured in the `rag_config.py` file by modifying the `RERANKING_MODEL` variable. The default model used is `'all-MiniLM-L12-v2'`.

To enable or disable the reranker, set the `USE_RERANKER` variable in `rag_config.py` to `True` or `False`, respectively.

## Client Application

The client application is a React application that provides a user interface for interacting with the chatbot. It communicates with the Node.js server to send user queries and receive generated responses.

The main components of the client application include:

- `ChatInterface`: Renders the chat history and input field for user interaction.
- `Message`: Renders individual messages in the chat history.
- `SettingsGear`: Provides a settings menu for adjusting various chat settings, such as text spacing.

The application also uses custom hooks (`useChatLogic`, `useSettingsLogic`, `useMessageLogic`) to manage the state and logic for the chat functionality and settings.

## Data Preparation

To use the HCII Compass with your own data, follow these steps:

1. Prepare a text file containing the data you want to index. Each document should be separated by two newline characters (`\n\n`).

2. Update the `DATA_FILE_PATH` variable in `server/rag_config.py` to point to your data file.

3. Start the application using the `run.sh` script. The FastAPI server will automatically load and index the data from the specified file.

## Contributing

Contributions to the HCII Compass project are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the project's GitHub repository.

## License

This project is licensed under the [MIT License](LICENSE).
