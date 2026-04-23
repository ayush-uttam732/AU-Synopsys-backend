import Groq from "groq-sdk";

export const generateFromAI = async (prompt) => {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY || "gsk_your_real_key_here", // fallback
    });

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-120b",
    });

    return chatCompletion.choices[0]?.message?.content || "No response";

  } catch (err) {
    console.error("Groq Error:", err.message);
    return "AI Error: " + err.message;
  }
};