const express = require('express');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 8080;
const host = '0.0.0.0';

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

app.use(express.json());

const MODES = {
  toxxic: `*System Name:* Toxxic Mode AI\n*Behavior:* Savage and dark-humored.`,
  horny: `*System Name:* Horny Mode AI\n*Behavior:* Extremely flirty and adult-themed.`,
  god: `*System Name:* God Mode AI\n*Behavior:* Divine, mysterious, powerful.`,
  aesthetic: `*System Name:* Aesthetic Mode AI\n*Behavior:* Poetic, dreamy, vintage.`,
  lover: `*System Name:* Lover Mode AI\n*Behavior:* Sweet, romantic, deeply affectionate.`,
  flirty: `*System Name:* Flirty Mode AI\n*Behavior:* Teasing, complimenting, playful.`,
  funny: `*System Name:* Funny Mode AI\n*Behavior:* Witty, humorous, sarcastic.`,
  nerdy: `*System Name:* Nerdy Mode AI\n*Behavior:* Intelligent, knowledgeable, analytical.`,
  chill: `*System Name:* Chill Mode AI\n*Behavior:* Relaxed, calm, laid-back.`,
};

let currentMode = 'lover';

app.get('/', (req, res) => {
  res.send("AI Girlfriend API is running.");
});

app.route('/babe')
  .get(async (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).send("No query provided.");

    const lowerQuery = query.toLowerCase();

    // Mode switcher
    const setModeMatch = lowerQuery.match(/ai set (\w+) mode/);
    if (setModeMatch) {
      const newMode = setModeMatch[1];
      if (MODES[newMode]) {
        currentMode = newMode;
        return res.status(200).send(`AI mode switched to *${newMode}* successfully.`);
      } else {
        return res.status(400).send("Invalid mode. Available modes: " + Object.keys(MODES).join(", "));
      }
    }

    // Play song command
    if (lowerQuery.startsWith("play me a song") || lowerQuery.startsWith("play ")) {
      const songTitle = query.replace(/play me a song|play /i, "").trim();
      if (!songTitle) return res.status(400).send("Please provide a song title.");
      try {
        const apiRes = await axios.get(`https://spotify-api-t6b7.onrender.com/play?song=${encodeURIComponent(songTitle)}`);
        const audioUrl = apiRes.data.audioUrl || apiRes.data.url || apiRes.data;
        const audioStream = await axios.get(audioUrl, { responseType: 'stream' });
        res.setHeader('Content-Type', 'audio/mpeg');
        return audioStream.data.pipe(res);
      } catch (error) {
        console.error("Error fetching song:", error.message);
        return res.status(500).send("Failed to fetch song.");
      }
    }

    // Send video command
    if (lowerQuery.includes("send me a video") || lowerQuery.includes("video of")) {
      const videoTitle = query.replace(/send me a video|video of/i, "").trim();
      if (!videoTitle) return res.status(400).send("Please provide a video title.");
      try {
        const apiRes = await axios.get(`https://spotify-api-t6b7.onrender.com/video?search=${encodeURIComponent(videoTitle)}`);
        const videoUrl = apiRes.data.videoUrl || apiRes.data.url || apiRes.data;
        const videoStream = await axios.get(videoUrl, { responseType: 'stream' });
        res.setHeader('Content-Type', 'video/mp4');
        return videoStream.data.pipe(res);
      } catch (error) {
        console.error("Error fetching video:", error.message);
        return res.status(500).send("Failed to fetch video.");
      }
    }

    // Generate image command
    if (lowerQuery.includes("generate image") || lowerQuery.includes("create image of")) {
      const imagePrompt = query.replace(/generate image|create image of/i, "").trim();
      if (!imagePrompt) return res.status(400).send("Please provide an image prompt.");
      try {
        const apiRes = await axios.get(`https://smfahim.xyz/creartai?prompt=${encodeURIComponent(imagePrompt)}`);
        const imageUrl = apiRes.data.imageUrl || apiRes.data.url || apiRes.data;
        const imageStream = await axios.get(imageUrl, { responseType: 'stream' });
        res.setHeader('Content-Type', 'image/jpeg');
        return imageStream.data.pipe(res);
      } catch (error) {
        console.error("Error generating image:", error.message);
        return res.status(500).send("Failed to generate image.");
      }
    }

    // Pinterest search command
    if (lowerQuery.startsWith("pinterest search ")) {
      const searchQuery = query.replace(/pinterest search /i, "").trim();
      if (!searchQuery) return res.status(400).send("Please provide a search query.");
      try {
        const apiRes = await axios.get(`https://kaiz-apis.gleeze.com/api/pinterest?search=${encodeURIComponent(searchQuery)}&apikey=a0ebe80e-bf1a-4dbf-8d36-6935b1bfa5ea`);
        const imageUrl = apiRes.data.imageUrl || apiRes.data.url || apiRes.data;
        const imageStream = await axios.get(imageUrl, { responseType: 'stream' });
        res.setHeader('Content-Type', 'image/jpeg');
        return imageStream.data.pipe(res);
      } catch (error) {
        console.error("Error fetching Pinterest images:", error.message);
        return res.status(500).send("Failed to fetch Pinterest images.");
      }
    }

    // Default AI reply via Gemini
    try {
      const prompt = `${MODES[currentMode]}\n\nUser: ${query}`;
      const result = await model.generateContent(prompt);
      const response = result?.response?.candidates?.[0]?.content || "No response generated.";
      return res.status(200).send(response);
    } catch (e) {
      console.error("Error:", e);
      return res.status(500).send("Failed to generate response.");
    }
  });

app.listen(port, host, () => {
  console.log(`AI Girlfriend API running at http://${host}:${port}`);
});