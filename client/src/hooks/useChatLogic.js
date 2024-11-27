import { useState } from 'react';
import axios from 'axios';
import config from '../config.js';

export function useChatLogic() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (input.trim()) {
      const newMessage = { text: input, sender: 'user' };
      setMessages([...messages, newMessage]);
      setInput('');
      setIsLoading(true);

      try {
        console.log('Sending message to FAISS server');
        const faissResponse = await axios.post(`${config.serverUrl}/rag-query`, {
          text: input,
        });

        console.log('Received response from FAISS server:', faissResponse.data);
        const { context, response } = faissResponse.data;

        console.log('Sending message to backend with context');
        const llmResponse = await axios.post(`${config.serverUrl}/generate`, {
          text: input,
          context: context,
        });

        console.log('Received response from backend:', llmResponse.data);
        const llmMessage = { text: llmResponse.data.generated_text, sender: 'llm' };
        setMessages((prevMessages) => [...prevMessages, llmMessage]);
      } catch (error) {
        console.error('Error sending message to backend:', error);
        console.error('Error details:', error.response ? error.response.data : 'No response data');
        const errorMessage = { text: `Error: Unable to generate response from LLM. Details: ${error.message}`, sender: 'llm' };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
  };
}
