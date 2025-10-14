import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all cart items
export async function GET() {
  try {
    const cartItems = await prisma.cartItem.findMany({
      include: { product: true },
    });
    return NextResponse.json(cartItems);
  } catch (err) {
    console.error("GET /api/cart error:", err);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// Add item to cart
export async function POST(req: Request) {
  try {
    const { productId, quantity } = await req.json();

    if (!productId || !quantity) {
      return NextResponse.json({ error: "Missing productId or quantity" }, { status: 400 });
    }

    const existing = await prisma.cartItem.findFirst({
      where: { productId },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { productId, quantity },
      });
    }

    const updatedCart = await prisma.cartItem.findMany({ include: { product: true } });
    return NextResponse.json(updatedCart);
  } catch (err: any) {
    console.error("POST /api/cart error:", err.message, err.stack);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json(); // works, but some setups need proper headers
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing cart item id" }, { status: 400 });
    }

    // Check if cart item exists
    const existing = await prisma.cartItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    await prisma.cartItem.delete({ where: { id } });

    const updatedCart = await prisma.cartItem.findMany({ include: { product: true } });
    return NextResponse.json(updatedCart);
  } catch (err: any) {
    console.error("DELETE /api/cart error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


