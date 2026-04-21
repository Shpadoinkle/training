import express, { Request, Response } from 'express'
import { ChatOllama } from '@langchain/ollama'
import { HumanMessage, AIMessage, SystemMessage, BaseMessage } from '@langchain/core/messages'

const app = express()
app.use(express.json())

const model = new ChatOllama({
  model: 'llama3.2',
  baseUrl: 'http://localhost:11434',
})

// Session history keyed by session ID
const sessions: Record<string, BaseMessage[]> = {}

interface ChatBody {
  message: string
  sessionId?: string
}

app.post('/chat', async (req: Request<{}, {}, ChatBody>, res: Response) => {
  const { message, sessionId = 'default' } = req.body

  if (!message) {
    res.status(400).json({ error: 'message is required' })
    return
  }

  if (!sessions[sessionId]) {
    sessions[sessionId] = [
      new SystemMessage('You are a helpful assistant.'),
    ]
  }

  sessions[sessionId].push(new HumanMessage(message))

  try {
    const response = await model.invoke(sessions[sessionId])
    sessions[sessionId].push(new AIMessage(response.content as string))
    res.json({ reply: response.content, sessionId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to get response from Ollama. Is it running?' })
  }
})

app.delete('/chat/:sessionId', (req: Request, res: Response) => {
  delete sessions[req.params.sessionId]
  res.json({ message: 'Session cleared' })
})

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
  console.log(`Chatbot running at http://localhost:${PORT}`)
  console.log('POST /chat  { "message": "Hello!", "sessionId": "abc" }')
})
