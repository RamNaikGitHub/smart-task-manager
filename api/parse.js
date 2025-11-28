// api/parse.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// IMPORTANT: This is a server-side file.
// We're using the 'import' syntax, which requires a modern Node.js environment.
// Hosting platforms like Vercel and Netlify handle this automatically.

// Initialize the AI model with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// The main function that will be executed when the API endpoint is called
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { command } = req.body;

    if (!command) {
        return res.status(400).json({ error: 'Command is required' });
    }

    // The detailed prompt telling the LLM how to behave
    const prompt = `
    You are an expert at parsing natural language commands for a to-do list application.
    Your task is to extract the task, an optional deadline, and an optional list name.
    The current date is: ${new Date().toDateString()}.

    Analyze the user's command and return a JSON object with the following structure:
    {
      "task": "The name of the task",
      "deadline": "The extracted deadline, or null if not present",
      "list": "The name of the list, or 'General' if not specified"
    }

    Here are some examples:

    Command: add "Finish the React tutorial"
    JSON: { "task": "Finish the React tutorial", "deadline": null, "list": "General" }

    Command: add "Submit my report" due by Friday
    JSON: { "task": "Submit my report", "deadline": "This coming Friday", "list": "General" }

    Command: can you add "Plan weekend trip" to the "Personal" list
    JSON: { "task": "Plan weekend trip", "deadline": null, "list": "Personal" }
    
    Command: remind me to call the vet tomorrow afternoon
    JSON: { "task": "Call the vet", "deadline": "Tomorrow afternoon", "list": "General" }
    
    Command: I need to buy groceries after work today
    JSON: { "task": "Buy groceries", "deadline": "Today after work", "list": "General" }

    Now, parse the following command.
    Command: ${command}
    JSON:
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // The LLM should return a JSON string, so we parse it
        const jsonData = JSON.parse(text);

        res.status(200).json(jsonData);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: "Failed to parse command with AI" });
    }
}
