import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// 1. Model — points at your local Ollama instance
const model = new ChatOllama({
  model: "llama3.2",
  baseUrl: "http://localhost:11434",
});

// 2. Prompt template — {topic} gets replaced at runtime
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant. Keep answers concise."],
  ["human", "Explain {topic} in simple terms."],
]);

// 3. Output parser — pulls the plain text out of the response object
const parser = new StringOutputParser();

// 4. Chain — connects prompt → model → parser using the pipe operator
const chain = prompt.pipe(model).pipe(parser);

// 5. Run it
const topic: string = process.argv[2] ?? "how a computer works";

console.log(`Topic: "${topic}"\n`);

const response: string = await chain.invoke({ topic });

console.log(response);
