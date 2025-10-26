const { GoogleGenerativeAI } = require('@google/generative-ai');

// Get your API key from the .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function parseCommand(command) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });


    const prompt = `
      You are a task parser for an automation app. Convert the following natural language command into a structured JSON object.
      The possible actions are: "send_email", "create_file", "post_to_social".

      Rules:
      1. For "send_email", extract "to", "subject", and "body".
      2. For "post_to_social", extract "platform" (e.g., twitter, linkedin) and "content".
      3. Only output a valid JSON object. Do not add any other text.

      Command: "${command}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the text in case the AI adds markdown
    const jsonText = text.replace('```json', '').replace('```', '').trim();
    
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error parsing command:", error);
    return { action: "error", details: "Failed to parse command" };
  }
}

module.exports = { parseCommand };