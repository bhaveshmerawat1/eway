import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();
    console.log("text and target language ======================", text, targetLang)
    if (!text || !targetLang) {
      return NextResponse.json({ error: "Text and target language required" }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `You are a translation engine. Translate text into ${targetLang}.` },
        { role: "user", content: text },
      ],
    });

    const translated = completion.choices[0].message?.content ?? "";
    return NextResponse.json({ translated });
  } catch (error) {
    console.error("Translation API Error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
