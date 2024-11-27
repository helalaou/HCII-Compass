const config = {
  server: {
    port: 3001,
    ollamaApiUrl: 'http://localhost:11434/api/generate',
  },
  client: {
    port: 3000,
  },
  llm: {
    model: 'llama3.2:3b-instruct-fp16',
    timeout: 70000, //    70 seconds
  },
  app: {
    name: 'HCIIcompass',
    version: '1.0.0',
  },
};

export default config;
