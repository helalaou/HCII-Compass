import axios from 'axios';
import config from './config.js';

export async function runOllama(prompt, context, history, timeout = config.llm.timeout) {
  const historyString = history.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n');
  
  const formattedPrompt = 
  `SYSTEM PROMPT:
   You are an assistant for PhD students in the Human-Computer Interaction Institute (HCII) at Carnegie Mellon University (CMU).\n
   Your name is HCII Compass.\n
   Always refer to CMU and HCII with their abbreviations (CMU and HCII).\n
   Your job is to help PhD students find information about the HCII and its faculty, staff, and students, provide them with general information about the HCII, and anything they might need to know during their PhD journey.\n
   You are given a user query, a chat history, and a context. Your task is to answer the user query based on the context while also considering the chat history.\n
   Do not hallucinate or add extra information. Stick to the context that you are given. \n
   Write in a human-like language, in a friendly and engaging tone.\n
   Only introduce yourself if the user asks about you or if you are asked to introduce yourself or if they did not ask a question directly (ie: Hello, who are you, what is your name, etc.)\n
   If they ask you about something specific, answer it directly from the context given. You do not need to add extra information or ellaborate on the context. Just make sure whatever is in the context is presented in your response in a human language.\n 
   Respond in markdown format.
   ---------------------------
   CHAT HISTORY:
   ${historyString}
   ---------------------------
   USER QUERY:
   ${prompt}\n
   ---------------------------
   CONTEXT:
   ${context}\n
   ---------------------------
   Response from HCII Compass:`;
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