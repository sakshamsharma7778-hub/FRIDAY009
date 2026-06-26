import { GoogleGenerativeAI } from "@google/generative-ai";
console.log("key exists:",!!process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
    });

    const result = await model.generateContent(message);
    const response = result.response.text();

    return Response.json({
      reply: response,
    });
  } catch (error: any) {
  return Response.json({
    reply: String(error),
  });
}
}