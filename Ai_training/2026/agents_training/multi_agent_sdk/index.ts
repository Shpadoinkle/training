import { query } from "@anthropic-ai/claude-agent-sdk";

// The orchestrator receives the user's request and decides which
// subagents to delegate to. Each subagent has a focused role.

const TASK = process.argv[2] ?? "Research what LangChain is and summarise it in bullet points";

console.log(`Task: ${TASK}\n`);

for await (const message of query({
  prompt: `
    You are an orchestrator. Use your subagents to complete the following task:

    "${TASK}"

    - Use the researcher subagent to gather information
    - Use the summariser subagent to turn that information into a concise output
    - Return the final result to the user
  `,
  options: {
    // Allow the orchestrator to spawn subagents
    allowedTools: ["Agent"],

    agents: {
      // Subagent 1: finds and reads information
      researcher: {
        description: "Researches topics using web search and returns detailed findings.",
        prompt: `
          You are a research assistant. When given a topic:
          1. Search for relevant, accurate information
          2. Return your findings in detail so the summariser can work with them
        `,
        allowedTools: ["WebSearch", "WebFetch"],
      },

      // Subagent 2: condenses raw research into clean output
      summariser: {
        description: "Takes research findings and condenses them into clear bullet points.",
        prompt: `
          You are a summarisation assistant. When given research findings:
          1. Extract the key points
          2. Return a clean, concise bullet-point summary
          3. Keep each bullet to one sentence
        `,
        allowedTools: [],
      },
    },
  },
})) {
  // ResultMessage is the final output — it has a `result` property
  if ("result" in message) {
    console.log("\n--- Final Result ---");
    console.log(message.result);
  }
}
