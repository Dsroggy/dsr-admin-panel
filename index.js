export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("DSR AI Bot Running");
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const GEMINI_KEY = process.env.GEMINI_KEY;

  const update = req.body;

  if (!update.message || !update.message.text) {
    return res.status(200).send("OK");
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

  return res.status(200).send("OK");
}
