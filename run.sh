#!/bin/bash

# Start the FastAPI server for FAISS
echo "Starting FastAPI server for FAISS..."
cd server
uvicorn rag_server:app --reload &
cd ..

# Start the Node.js server
echo "Starting Node.js server..."
cd server
npm install
npm start &
cd ..

# Wait for the servers to start
echo "Waiting for servers to start..."
sleep 5

# Start the React app
echo "Starting React app..."
cd client
npm install
npm start &
cd ..

echo "All components are running!"
echo "Access the application at http://localhost:3000"

# Wait for user input to stop the servers
read -p "Press [ENTER] to stop the servers..."

# Stop the servers
echo "Stopping servers..."
pkill -f "uvicorn rag_server:app"
pkill -f "node server/server.js"
pkill -f "react-scripts start"

echo "All components stopped." 