import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET all special orders
export async function GET() {
  try {
    const orders = await prisma.specialOrder.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (err) {
    console.error("GET /api/special-order error:", err);
    return NextResponse.json({ error: "Failed to fetch special orders" }, { status: 500 });
  }
}

// ✅ POST create new special order
export async function POST(req: Request) {
  try {
    const { quantity, productName } = await req.json();

    if (!quantity || !productName) {
      return NextResponse.json({ error: "Missing productName or quantity" }, { status: 400 });
    }

    const order = await prisma.specialOrder.create({
      data: { productName, quantity },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/special-order error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
