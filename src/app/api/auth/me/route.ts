import prisma from "@/lib/prisma"; // 👈 default export version
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = (await cookies()).get("app_token")?.value;
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const payload = verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
