import { GET, POST } from "@/app/api/products/special-order/route";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  specialOrder: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
}));

// ✅ Mock NextResponse.json() so it behaves like real Response
jest.mock("next/server", () => ({
  NextResponse: {
    json: (data: any, init?: any) => ({
      status: init?.status ?? 200,
      json: async () => data, // mimic real fetch Response.json()
    }),
  },
}));

describe("API: /api/products/special-order", () => {
  afterEach(() => jest.clearAllMocks());

  describe("GET", () => {
    it("should return a list of special orders", async () => {
      (prisma.specialOrder.findMany as jest.Mock).mockResolvedValue([
        { id: "1", productName: "Table", quantity: 2 },
      ]);

      const response = await GET();
      const data = await response.json();

      expect(prisma.specialOrder.findMany).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(data).toEqual([{ id: "1", productName: "Table", quantity: 2 }]);
    });

    it("should handle errors gracefully", async () => {
      (prisma.specialOrder.findMany as jest.Mock).mockRejectedValue(new Error("DB Error"));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to fetch special orders");
    });
  });

  describe("POST", () => {
    it("should create a new special order", async () => {
      const mockOrder = { id: "1", productName: "Chair", quantity: 5 };
      (prisma.specialOrder.create as jest.Mock).mockResolvedValue(mockOrder);

      const req = new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ productName: "Chair", quantity: 5 }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(prisma.specialOrder.create).toHaveBeenCalledWith({
        data: { productName: "Chair", quantity: 5 },
      });
      expect(response.status).toBe(201);
      expect(data).toEqual(mockOrder);
    });

    it("should return 400 if fields are missing", async () => {
      const req = new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Missing productName or quantity");
    });

    it("should handle DB errors", async () => {
      (prisma.specialOrder.create as jest.Mock).mockRejectedValue(new Error("Create failed"));

      const req = new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ productName: "Sofa", quantity: 3 }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Create failed");
    });
  });
});
