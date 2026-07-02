import { GoogleGenerativeAI } from "@google/generative-ai";
import { addMemory, getMemories } from "./memory";

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
      reply: "I'm sorry, Saksham. Gemini is busy right now. Try again in a moment.",
    });
  }
}