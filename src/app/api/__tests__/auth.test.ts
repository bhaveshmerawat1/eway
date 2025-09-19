import { POST as logoutHandler } from "@/app/api/auth/logout/route";
import { GET as meHandler } from "@/app/api/auth/me/route";
import prisma from "@/lib/prisma";
import * as auth from "@/lib/auth";
import { cookies } from "next/headers";

jest.mock("@/lib/prisma", () => ({
  user: {
    findUnique: jest.fn(),
  },
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("Auth session APIs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Logout API", () => {
    it("should delete cookie and return success", async () => {
      const deleteMock = jest.fn();
      (cookies as jest.Mock).mockResolvedValueOnce({
        delete: deleteMock,
      });

      const res = await logoutHandler();
      const data = await res.json();

      expect(deleteMock).toHaveBeenCalledWith("app_token");
      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe("Me API", () => {
    it("should return user: null if no token cookie", async () => {
      (cookies as jest.Mock).mockResolvedValueOnce({
        get: jest.fn().mockReturnValue(undefined),
      });

      const res = await meHandler();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.user).toBeNull();
    });

    it("should return user: null if verifyToken fails", async () => {
      (cookies as jest.Mock).mockResolvedValueOnce({
        get: jest.fn().mockReturnValue({ value: "bad.token" }),
      });
      jest.spyOn(auth, "verifyToken").mockReturnValueOnce(null);

      const res = await meHandler();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.user).toBeNull();
    });

    it("should return user: null if user not found in DB", async () => {
      (cookies as jest.Mock).mockResolvedValueOnce({
        get: jest.fn().mockReturnValue({ value: "valid.token" }),
      });
      jest.spyOn(auth, "verifyToken").mockReturnValueOnce({ userId: "123" });
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const res = await meHandler();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.user).toBeNull();
    });

    it("should return user object if token is valid and user exists", async () => {
      (cookies as jest.Mock).mockResolvedValueOnce({
        get: jest.fn().mockReturnValue({ value: "valid.token" }),
      });
      jest.spyOn(auth, "verifyToken").mockReturnValueOnce({ userId: "123" });
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
        id: "123",
        email: "test@example.com",
        name: "Test User",
      });

      const res = await meHandler();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.user).toEqual({
        id: "123",
        email: "test@example.com",
        name: "Test User",
      });
    });
  });
});
