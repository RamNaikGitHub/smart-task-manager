// src/agent.ts

import type { AgentAction } from "./types";

export async function parseCommand(command: string): Promise<AgentAction | null> {
  try {
    // const response = await fetch("/api/parse", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ command }),
    // });

    // if (!response.ok) {
    //   throw new Error(`API request failed with status ${response.status}`);
    // }

    // const data = await response.json();
    // const data2 = await response.json();
    // mock data and deadline current date with 20seconds ahead for testing and in string format
    const data = {
      task: command,
      deadline: new Date(Date.now() + 10000).toLocaleString(),
      list: "Work",
    }; // Mocked response
    // Create the structured action object, which TypeScript will validate
    const action: AgentAction = {
      intent: "ADD_TASK",
      payload: {
        id: Date.now(),
        text: data.task,
        deadline: data.deadline,
        list: data.list,
        completed: false,
      },
    };
    return action;
  } catch (error) {
    console.error("Error parsing command:", error);
    return null; // Return null on failure
  }
}
