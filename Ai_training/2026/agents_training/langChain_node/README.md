# LangChain Node Example

A minimal LangChain chain using a local Ollama model.

## Prerequisites

- Node.js 18+
- Ollama running locally (`ollama serve`)
- Llama model pulled (`ollama pull llama3.2`)

## Setup

```bash
npm install
```

## Usage

```bash
# Default topic
npm start

# Custom topic
node index.js "object oriented programming"
node index.js "how LangChain works"
```

## How it works

LangChain uses a **pipe** pattern to chain steps together:

```
Prompt Template  →  Model  →  Output Parser  →  Result
```

| Step | What it does |
|---|---|
| `ChatPromptTemplate` | Builds the message with your variable filled in |
| `ChatOllama` | Sends it to Ollama and gets a response |
| `StringOutputParser` | Extracts the plain text from the response object |

The `chain.invoke({ topic })` call runs all three steps in sequence.
