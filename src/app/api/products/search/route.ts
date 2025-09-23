import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ products: [] }, { status: 200 });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q.toLowerCase() } },
          { description: { contains: q } },
          { color: { contains: q } },
          { size: { contains: q } },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        size: true,
        color: true,
        imageUrl: true,
      },
      take: 10,
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Product search error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
