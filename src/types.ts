// src/types.ts

export interface Task {
  id: number;
  text: string;
  deadline: string | null;
  list: string;
  completed: boolean;
  notified: boolean; // <-- Add this! To track if a reminder was sent.
}

export interface AgentAction {
  intent: "ADD_TASK";
  payload: Omit<Task, "notified">; // The AI doesn't need to decide this initially.
}
