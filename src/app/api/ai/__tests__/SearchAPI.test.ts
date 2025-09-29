import { POST } from "@/app/api/ai/route"; // adjust path to your route
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Mock OpenAI SDK
jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  }));
});

const mockCreate = (OpenAI as unknown as jest.Mock).mock
  .results[0].value.chat.completions.create;

describe("AI Search API", () => {
  it("returns answer when query is provided", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: "Mocked AI answer" } }],
    });

    const req = new Request("http://localhost/api/search", {
      method: "POST",
      body: JSON.stringify({ query: "Hello AI" }),
    });

    const res = (await POST(req)) as NextResponse;
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.answer).toBe("Mocked AI answer");
    expect(mockCreate).toHaveBeenCalledWith({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hello AI" }],
    });
  });

  it("returns 400 if no query provided", async () => {
    const req = new Request("http://localhost/api/search", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = (await POST(req)) as NextResponse;
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("No query provided");
  });
});
