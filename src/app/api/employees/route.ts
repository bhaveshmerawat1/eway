import  prisma from "@/lib/prisma";
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

export async function GET() {
  const userId = await getUserId(); // 👈 await here
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const employees = await prisma.employee.findMany({
    where: { userId }
  });

  return NextResponse.json({ employees });
}


// export async function POST(req: Request) {
//   const userId = getUserId();
//   if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

//   const data = await req.json();
//   const err = validateEmployee(data);
//   if (err) return NextResponse.json({ error: err }, { status: 400 });

//   const emp = await prisma.employee.create({
//     data: { ...data, age: data.age ? Number(data.age) : null, userId },
//   });

//   return NextResponse.json({ employee: emp }, { status: 201 });
// }


export async function POST(req: Request) {
  const userId = await getUserId(); // ✅ await here
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const data = await req.json();
  const err = validateEmployee(data);
  if (err) {
    return NextResponse.json({ error: err }, { status: 400 });
  }

  const emp = await prisma.employee.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age ? Number(data.age) : null,
      address: data.address,
      mobile: data.mobile,
      joinedAt: new Date(data.joinedAt),
      userId,
    },
  });

  return NextResponse.json({ employee: emp }, { status: 201 });
}
