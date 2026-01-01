import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const CHAT_FILE = "./chats.json";

/* ensure chats.json exists */
if (!fs.existsSync(CHAT_FILE)) {
  fs.writeFileSync(CHAT_FILE, JSON.stringify({}));
}

function readChats() {
  return JSON.parse(fs.readFileSync(CHAT_FILE, "utf8"));
}
function saveChats(data) {
  fs.writeFileSync(CHAT_FILE, JSON.stringify(data, null, 2));
}

/* health */
app.get("/", (req, res) => {
  res.send("DSR AI Backend running (fallback mode)");
});

/* login */
app.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });
  res.json({ success: true });
});

/* history */
app.get("/history/:user", (req, res) => {
  const chats = readChats();
  res.json(chats[req.params.user] || []);
});

/* SIMPLE AI LOGIC (100% reply guaranteed) */
function simpleAI(text) {
  text = text.toLowerCase();

  if (text.includes("hello") || text.includes("hi"))
    return "Hello 👋 How can I help you today?";

  if (text.includes("how are you"))
    return "I’m doing great 😄 Thanks for asking!";

  if (text.includes("your name"))
    return "My name is DSR AI 🤖";

  if (text.includes("help"))
    return "Sure! Tell me what you need help with.";

  return `You said: "${text}". I am learning and will get smarter soon 🚀`;
}

/* chat */
app.post("/chat", (req, res) => {
  const { user, message } = req.body;
  if (!user || !message) {
    return res.json({ reply: "Invalid input" });
  }

  const reply = simpleAI(message);

  const chats = readChats();
  if (!chats[user]) chats[user] = [];
  chats[user].push({ user: message, ai: reply });
  saveChats(chats);

  res.json({ reply });
});

/* start */
app.listen(PORT, () => {
  console.log(`🔥 DSR AI Backend running on port ${PORT}`);
});
