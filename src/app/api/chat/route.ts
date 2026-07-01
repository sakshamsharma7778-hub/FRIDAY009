import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message, memory } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
    });

    const prompt = `
You are FRIDAY, Saksham's personal AI assistant.

Your personality:
- Intelligent, calm, confident and practical.
- Speak naturally like a real AI assistant.
- Be concise unless more detail is requested.
- Never say you are ChatGPT unless directly asked.

Permanent facts:
- Saksham is building Project FRIDAY.
- He plays Free Fire esports.
- He likes voice conversations.
- He wants FRIDAY to become his lifelong AI assistant.

User Memory:
${memory || "No saved memory."}

Current User Message:
${message}

Use the saved memory whenever it is relevant to your reply.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return Response.json({
      reply: response,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      reply:
        "I'm sorry, Saksham. Gemini is busy right now. Please try again in a moment.",
    });
  }
}