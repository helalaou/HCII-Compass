import axios from 'axios';
import config from './config.js';

export async function runOllama(prompt, context, timeout = config.llm.timeout) {
  const formattedPrompt = `User Query: ${prompt}\nContext: ${context}\nAssistant:`;
  try {
    console.log('Starting Ollama request with prompt:', formattedPrompt);
    const response = await axios.post(
      config.server.ollamaApiUrl,
      {
        model: config.llm.model,
        prompt: formattedPrompt,
        stream: false,
      },
      { timeout: timeout }
    );
    console.log('Ollama response received:', response.data.response);
    return response.data.response.trim();
  } catch (error) {
    console.error('Error in runOllama:', error.message);
    throw error;
  }
} 