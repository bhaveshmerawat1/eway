// import { GET, POST } from '../route';
import { POST, GET } from "@/app/api/products/special-order/route";
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  SpecialOrder: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Special Order API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/products/special-order', () => {
    it('should return all special orders successfully', async () => {
      const mockOrders = [
        { id: 1, productName: 'Test Product 1', quantity: 2 },
        { id: 2, productName: 'Test Product 2', quantity: 3 },
      ];

      (prisma.specialOrder.findMany as jest.Mock).mockResolvedValue(mockOrders);

      const response = await GET();
      const data = await response.json();

      expect(prisma.specialOrder.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(data).toEqual(mockOrders);
    });

    it('should handle errors during fetch', async () => {
      const error = new Error('Database error');
      (prisma.specialOrder.findMany as jest.Mock).mockRejectedValue(error);

      const response = await GET();
      const data = await response.json();

      expect(data).toEqual({ error: 'Failed to fetch special orders' });
      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/products/special-order', () => {
    it('should create a new special order successfully', async () => {
      const mockOrder = {
        id: 1,
        productName: 'New Product',
        quantity: 5,
        createdAt: new Date(),
      };

      (prisma.specialOrder.create as jest.Mock).mockResolvedValue(mockOrder);

      const request = new Request('http://localhost:3000/api/products/special-order', {
        method: 'POST',
        body: JSON.stringify({ productName: 'New Product', quantity: 5 }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(prisma.specialOrder.create).toHaveBeenCalledWith({
        data: { productName: 'New Product', quantity: 5 },
      });
      expect(data).toEqual(mockOrder);
      expect(response.status).toBe(201);
    });

    it('should return 400 if productName is missing', async () => {
      const request = new Request('http://localhost:3000/api/products/special-order', {
        method: 'POST',
        body: JSON.stringify({ quantity: 5 }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toEqual({ error: 'Missing productName or quantity' });
      expect(response.status).toBe(400);
      expect(prisma.specialOrder.create).not.toHaveBeenCalled();
    });

    it('should return 400 if quantity is missing', async () => {
      const request = new Request('http://localhost:3000/api/products/special-order', {
        method: 'POST',
        body: JSON.stringify({ productName: 'New Product' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toEqual({ error: 'Missing productName or quantity' });
      expect(response.status).toBe(400);
      expect(prisma.specialOrder.create).not.toHaveBeenCalled();
    });

    it('should handle database errors during creation', async () => {
      const error = new Error('Database error');
      (prisma.specialOrder.create as jest.Mock).mockRejectedValue(error);

      const request = new Request('http://localhost:3000/api/products/special-order', {
        method: 'POST',
        body: JSON.stringify({ productName: 'New Product', quantity: 5 }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toEqual({ error: 'Database error' });
      expect(response.status).toBe(500);
    });
  });
});