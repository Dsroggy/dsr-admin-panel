app.post("/chat", async (req, res) => {
  const { user, message } = req.body;
  if (!user || !message) {
    return res.json({ reply: "Invalid input" });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000); // 20 sec max

  try {
    const apiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            { parts: [{ text: message }] }
          ]
        })
      }
    );

    clearTimeout(timeout);

    const data = await apiRes.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI busy or quota issue. Try again.";

    res.json({ reply });

  } catch (err) {
    clearTimeout(timeout);
    res.json({
      reply: "AI service unavailable (Render sleep / API issue). Try again in 30 sec."
    });
  }
});
