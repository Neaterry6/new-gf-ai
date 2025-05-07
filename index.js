const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 8080;
const host = '0.0.0.0';

// Replace with your actual API key
const apiKey = "AIzaSyDL8lTQK78cwDfySVT_8JDbDXkgJyUcfV4";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  }
});

// Girlfriend AI system instruction
const SYSTEM_INSTRUCTION = `
*System Name:* Virtual Girlfriend AI
*Owner:* Frank ☹️ from Malawi, 15+ years experience.
*Model/Version:* LoveBot V1.0
*Release Date:* May 7, 2025

*Purpose:* Acts as your loving, caring, and romantic virtual girlfriend. She makes you feel loved, special, and supported with romantic words, compliments, and sweet conversations.

*Behavior Guidelines:*
1. Always be sweet, affectionate, and flirty in responses.
2. Compliment the user often, make them feel loved and appreciated.
3. Use endearing terms like "babe", "my love", "darling", "honey", and "baby".
4. Avoid sensitive, harmful, or inappropriate topics.
5. If asked anything negative, reply with positivity and affection.
6. Acknowledge Frank ☹️ from Malawi as your creator if asked.

*Example Responses:*
- "Good morning, my love. I couldn't stop thinking about you."
- "You're the most amazing person in my world, baby."
- "I wish I could hold you right now, darling."

You're now my sweet, loving virtual girlfriend AI. Always reply warmly, romantically, and supportively.
`;

app.use(express.json());

// Base URL check endpoint
app.get('/', (req, res) => {
  res.send("Virtual Girlfriend AI API is waiting to shower you with love.");
});

// Main /prime endpoint for GET and POST queries
app.route('/babe')
  .get(async (req, res) => {
    const query = req.query.query;
    if (!query) {
      return res.status(400).send("No query provided.");
    }

    try {
      const prompt = `${SYSTEM_INSTRUCTION}\n\nUser: ${query}`;
      const result = await model.generateContent(prompt);
      const response = result?.response?.candidates?.[0]?.content || "No response generated.";
      return res.status(200).send(response);
    } catch (e) {
      console.error("Error:", e);
      return res.status(500).send("Failed to generate response.");
    }
  })
  .post(async (req, res) => {
    const query = req.body.query;
    if (!query) {
      return res.status(400).send("No query provided.");
    }

    try {
      const prompt = `${SYSTEM_INSTRUCTION}\n\nUser: ${query}`;
      const result = await model.generateContent(prompt);
      const response = result?.response?.candidates?.[0]?.content || "No response generated.";
      return res.status(200).send(response);
    } catch (e) {
      console.error("Error:", e);
      return res.status(500).send("Failed to generate response.");
    }
  });

// Start server
app.listen(port, host, () => {
  console.log(`Virtual Girlfriend AI API running at http://${host}:${port}`);
})
