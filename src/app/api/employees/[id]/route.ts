import  prisma  from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { validateEmployee } from "@/lib/apiValidate";
import { NextResponse } from "next/server";

async function getUserId(): Promise<number | null> {
  try {
    const token = (await cookies()).get("app_token")?.value;
    if (!token) return null;
    const payload = verifyToken(token);
    return payload.userId as number;
  } catch {
    return null;
  }
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const userId = getUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const emp = await prisma.employee.findUnique({ where: { id: Number(params.id) } });
  if (!emp || emp.userId !== await userId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ employee: emp });
}


export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const data = await req.json();
  const err = validateEmployee(data,true);
  if (err) return NextResponse.json({ error: err }, { status: 400 });

  // Only update valid fields
  const updated = await prisma.employee.updateMany({
    where: { id: Number(params.id), userId },
    data: {
      firstName: data.firstName?.trim(),
      lastName: data.lastName?.trim() || null,
      age: data.age ? Number(data.age) : null,
      address: data.address?.trim() || null,
      mobile: data.mobile ? String(data.mobile) : null,
      joinedAt: new Date(data.joinedAt)
    },
  });

  if (updated.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const emp = await prisma.employee.findUnique({
    where: { id: Number(params.id) },
  });

  return NextResponse.json({ employee: emp });
}


export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const deleted = await prisma.employee.deleteMany({
      where: { id: Number(params.id), userId },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    // 204 No Content should have no body
    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error("DELETE /employees/:id error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}