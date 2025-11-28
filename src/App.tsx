import React, { useState, useEffect } from "react";
import { parseCommand } from "./agent";
import InputBar from "./components/InputBar";
import TaskList from "./components/TaskList";
import "./App.css";
import type { Task } from "./types";

// --- The Agent's "Tool" ---
// This function allows the agent to execute a browser notification.
function showNotification(taskText: string) {
  if (Notification.permission === "granted") {
    new Notification("Task Reminder!", {
      body: taskText,
    });
  }
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agentMessage, setAgentMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // --- AGENT HEARTBEAT & EXECUTION LOGIC ---
  useEffect(() => {
    // 1. On startup, the agent asks for permission to use its notification tool.
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // 2. The agent's "heartbeat" loop, which runs every 10 seconds.
    const agentInterval = setInterval(() => {
      const now = new Date();

      // A function to be called from within the loop to update state
      setTasks((currentTasks) =>
        currentTasks.map((task) => {
          // 3. The "Think" phase: check conditions for each task
          if (task.deadline && !task.completed && !task.notified) {
            const deadlineTime = new Date(task.deadline);

            // Check if the deadline has passed
            if (now > deadlineTime) {
              console.log(`Agent decided to act on: "${task.text}"`);

              // 4. The "Act" phase: use the tool
              showNotification(task.text);

              // Update the task's state to prevent re-notifying
              return { ...task, notified: true };
            }
          }
          return task; // Return task unchanged if no action is needed
        })
      );
    }, 10000); // The agent "wakes up" every 10 seconds

    // Cleanup function to stop the agent when the component unmounts
    return () => clearInterval(agentInterval);
  }, []); // The empty array ensures this effect runs only once on startup

  const handleNewCommand = async (command: string) => {
    setIsLoading(true);
    setAgentMessage("");
    const action = await parseCommand(command);
    setIsLoading(false);

    if (action && action.intent === "ADD_TASK") {
      // Add the 'notified' property when creating a new task
      const newTask: Task = { ...action.payload, notified: false };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setAgentMessage(`Okay, I've added "${action.payload.text}".`);
    } else {
      setAgentMessage("Sorry, I had trouble understanding that.");
    }

    setTimeout(() => setAgentMessage(""), 4000);
  };

  return (
    <div className="app-container">
      <header>
        <h1>The Executing Agent</h1>
      </header>
      <main>
        {agentMessage && <p className="agent-message">{agentMessage}</p>}
        {isLoading && <p className="loading-message">Thinking...</p>}
        <TaskList tasks={tasks} />
      </main>
      <footer>
        <InputBar onNewCommand={handleNewCommand} disabled={isLoading} />
      </footer>
    </div>
  );
}

export default App;
