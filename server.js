app.post("/chat", async (req, res) => {
  try {
    const { user, message } = req.body;
    if (!user || !message) {
      return res.json({ reply: "Invalid input" });
    }

    const apiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: message }] }
          ]
        })
      }
    );

    const data = await apiRes.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI busy or quota issue. Try again.";

    res.json({ reply });

  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.json({
      reply: "AI service temporarily unavailable. Please try again."
    });
  }
});
