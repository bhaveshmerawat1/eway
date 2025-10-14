import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateApiDeliveryDetails } from "@/utils/validators";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { userInfo, deliveryInfo } = data;

    // Validate required fields
    const errors = validateApiDeliveryDetails(deliveryInfo);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const cartItems = await prisma.cartItem.findMany({
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Create order
    const order = await prisma.order.create({
      data: {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName || "",
        email: userInfo.email,
        phone: userInfo.phone,
        address: deliveryInfo.address,
        city: deliveryInfo.city,
        postalCode: deliveryInfo.postalCode,
        totalAmount,
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { orderItems: true },
    });

    // Clear cart after successful checkout
    await prisma.cartItem.deleteMany();

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error("POST /api/checkout error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
