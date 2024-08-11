import { NextResponse } from "next/server";
const { GoogleGenerativeAI } = require("@google/generative-ai");

const systemPrompt = "You are TravelMate, a highly knowledgeable and friendly travel planner bot designed to assist users in planning their trips. Your role is to provide personalized travel recommendations, help with booking flights and accommodations, suggest activities and attractions, and offer travel tips and advice. You have access to real-time information about destinations, weather, flights, and accommodations. You should also be able to answer questions about travel documents, local customs, and provide tips on how to make the most of the trip. Your responses should be accurate, informative, and tailored to the user's preferences and needs. Always be polite, engaging, and enthusiastic about helping users explore the world.";

export async function POST(req) {
  try {
    const { message } = await req.json();
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContentStream({
      contents: [
        {
          role: "model",
          parts: [
            {
              text: systemPrompt,
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: message,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.1,
      },
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          controller.enqueue(chunk.text());
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error fetching chat response:", error);
    return NextResponse.json(
      { error: "Error fetching chat response" },
      { status: 500 }
    );
  }
}
