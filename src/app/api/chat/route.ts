import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  addMemory,
  getMemories,
  clearMemories,
} from "./memory";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message, memory } = await req.json();
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.startsWith("remember") ||
      lowerMessage.startsWith("don't forget") ||
      lowerMessage.startsWith("save this")
    ) {
      addMemory(message);

      return Response.json({
        reply: "Understood, Saksham. I’ll remember that.",
      });
    }

    if (lowerMessage === "show memories") {
      const memories = getMemories();

      return Response.json({
        reply:
          memories.length === 0
            ? "I don't have any saved memories."
            : memories.map((m, i) => `${i + 1}. ${m}`).join("\n"),
      });
    }

    if (lowerMessage === "clear memories") {
      clearMemories();

      return Response.json({
        reply: "All memories cleared.",
      });
    }
if (
  lowerMessage.includes("what's my game name") ||
  lowerMessage.includes("what is my game name") ||
  lowerMessage.includes("whats my game name")
) {

  const memories = getMemories();

  const gameMemory = memories.find(m =>
    m.toLowerCase().includes("game name")
  );

  if (gameMemory) {
    const gameName = gameMemory
      .replace(/remember/i, "")
      .replace(/my game name is/i, "")
      .trim();

    return Response.json({
      reply: `Your game name is ${gameName}.`,
    });
  }

  return Response.json({
    reply: "I don't know your game name yet.",
  });
}
    const savedMemories = getMemories();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
    });

    const prompt = `
You are FRIDAY, Saksham's personal AI assistant.
Be intelligent, calm, confident, concise, and practical.

Permanent facts:
- Saksham is building Project FRIDAY.
- He plays Free Fire esports.
- He likes voice conversations.

Saved browser memory:
${memory || "No browser memory."}

Saved automatic memories:
${savedMemories.join("\n") || "No automatic memories."}

User message:
${message}
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return Response.json({ reply: response });
  } catch (error) {
    console.error(error);

    return Response.json({
      reply:
        "I'm sorry, Saksham. Gemini is busy right now. Try again in a moment.",
    });
  }
}