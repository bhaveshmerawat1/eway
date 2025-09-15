import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Default employee
const defaultEmployee = {
  id:0,
  firstName: "John",
  lastName: "Doe",
  age: 30,
  address: "123 Main Street",
  mobile: "9999999999",
};

// GET: Fetch employees
export async function GET() {
  try {
    let employees = await prisma.employee.findMany();

    // If no employees exist, insert default
    if (employees.length === 0) {
      const created = await prisma.employee.create({
        data: defaultEmployee,
      });
      employees = [created];
    }

    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    console.error("Error ====", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Add new employee
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📩 Incoming POST body:", body);

    const employee = await prisma.employee.create({
      data: {
        id:body.id,
        firstName: body.firstName,
        lastName: body.lastName,
        age: body.age,
        address: body.address,
        mobile: body.mobile,
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error: any) {
    console.error("Error ====", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
