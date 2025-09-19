import { POST } from "@/app/api/auth/login/route";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

jest.mock("@/lib/prisma", () => ({
  user: {
    findUnique: jest.fn(),
  },
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("POST /api/auth/login", () => {
  const mockCookies = {
    set: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (cookies as jest.Mock).mockReturnValue(mockCookies);
  });

  it("should login successfully with valid credentials", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "1",
      email: "test@example.com",
      password: "hashedpassword",
      name: "Test User",
    });

    (compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mocked-jwt");

    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "123456",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const text = await res.text();          // ✅ workaround
    const data = JSON.parse(text);

    expect(res.status).toBe(200);
    expect(data.user.email).toBe("test@example.com");
    expect(mockCookies.set).toHaveBeenCalledWith(
      "app_token",
      "mocked-jwt",
      expect.any(Object)
    );
  });

  it("should fail with invalid credentials (wrong password)", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "1",
      email: "test@example.com",
      password: "hashedpassword",
      name: "Test User",
    });

    (compare as jest.Mock).mockResolvedValue(false);

    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "wrongpassword",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const text = await res.text();
    const data = JSON.parse(text);

    expect(res.status).toBe(401);
    expect(data.error).toBe("Invalid credentials");
  });

  it("should fail when user not found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "notfound@example.com",
        password: "123456",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const text = await res.text();
    const data = JSON.parse(text);

    expect(res.status).toBe(401);
    expect(data.error).toBe("Invalid credentials");
  });
});
