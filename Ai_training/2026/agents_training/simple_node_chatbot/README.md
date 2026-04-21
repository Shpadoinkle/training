# Llama Chatbot

A local LLM chatbot using Express, LangChain, and Ollama.

## Prerequisites

- [Node.js](https://nodejs.org)
- [Ollama](https://ollama.com) installed and running

## Setup

```bash
# Install Ollama (macOS)
brew install ollama

# Pull the Llama model (only needed once)
ollama pull llama3.2

# Install dependencies
npm install
```

## Running

```bash
# Start Ollama (in a separate terminal)
ollama serve

# Start the server
npm run dev
```

Server runs at `http://localhost:3000`.

## API

### Send a message

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the capital of France?", "sessionId": "user1"}'
```

**Body**

| Field | Type | Description |
|---|---|---|
| `message` | string | Required. The user's message. |
| `sessionId` | string | Optional. Identifies the conversation. Defaults to `"default"`. |

**Response**

```json
{ "reply": "The capital of France is Paris.", "sessionId": "user1" }
```

### Clear conversation history

```bash
curl -X DELETE http://localhost:3000/chat/user1
```

## Notes

- Conversation history is stored in-memory per `sessionId` — it resets when the server restarts.
- To change the model, update the `model` field in `server.js`.
