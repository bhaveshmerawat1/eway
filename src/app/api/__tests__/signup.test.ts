import { POST } from "@/app/api/auth/signup/route";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

describe("Signup API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if email or password is missing", async () => {
    const req = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email: "", password: "" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Email and password are required");
  });

  it("should return 400 if user already exists", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: "1", email: "test@example.com" });

    const req = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com", password: "password123" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("User already exists");
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: "test@example.com" } });
  });

  it("should create a new user and return 201", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
    (prisma.user.create as jest.Mock).mockResolvedValueOnce({
      id: "123",
      email: "new@example.com",
      name: "New User",
    });

    const req = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email: "new@example.com", password: "password123" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.user).toEqual({
      id: "123",
      email: "new@example.com",
      name: "New User",
    });
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: "new@example.com",
        password: expect.any(String), // hashed password
      }),
    });
  });

  it("should return 500 on unexpected error", async () => {
    (prisma.user.findUnique as jest.Mock).mockRejectedValueOnce(new Error("DB down"));

    const req = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email: "fail@example.com", password: "password123" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Something went wrong");
  });
});
