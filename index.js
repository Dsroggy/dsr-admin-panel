import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.send("DSR AI Bot Running");
  }

  const BOT_TOKEN = "8259113413:AAECzoe2V1D3xHFDgCF3nidRE6Gcj_ApOf8";
  const GEMINI_KEY = "AIzaSyDPk-xC2vBHecYUbkRwPphwkxjV5pFK0bY";

  const update = req.body;

  if (!update.message || !update.message.text) {
    return res.send("OK");
  }

  const chatId = update.message.chat.id;
  const userText = update.message.text;

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `
You are DSR AI.
Talk in Hindi using English letters.
Behave like a brother.
User name is DSR.

User said: ${userText}
            `
          }]
        }]
      })
    }
  );

  const data = await geminiRes.json();
  const reply =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "DSR bhai, thoda issue aa gaya.";

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: reply
    })
  });

  res.send("OK");
}
