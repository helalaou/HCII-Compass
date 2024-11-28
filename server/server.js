import express from 'express';
import cors from 'cors';
import axios from 'axios';
import config from './config.js';
import { runOllama } from './ollamaModule.js';

const app = express();
const port = config.server.port;

app.use(cors({
  origin: `http://localhost:${config.client.port}`, // Allow requests from React app
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const OLLAMA_API_URL = config.server.ollamaApiUrl;

let chatHistory = [];

// Generate Response Route
app.post('/generate', async (req, res) => {
  try {
    const { text, context } = req.body;
    console.log('Received request to generate response');

    console.log('Running Ollama');
    const generatedText = await runOllama(text, context, chatHistory);
    console.log('Sending generated response');
    
    chatHistory.push({role: 'user', content: text});
    chatHistory.push({role: 'assistant', content: generatedText});
    
    res.json({ generated_text: generatedText });
  } catch (error) {
    console.error('Error in /generate route:', error);
    res.status(500).json({ error: 'An error occurred while generating the response.' });
  }
});

// Test Route
app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Server is working' });
});

// rag Query Route
app.post('/rag-query', async (req, res) => {
  try {
    const { text } = req.body;
    console.log('Received request to query FAISS');

    const response = await axios.post(`${config.server.faissApiUrl}/query`, { query: text });
    console.log('FAISS response received:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error in /rag-query route:', error);
    res.status(500).json({ error: 'An error occurred while querying FAISS.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`${config.app.name} server v${config.app.version} running at http://localhost:${port}`);
  console.log('Registered routes:');
  app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
      console.log(r.route.path);
    }
  });
});
