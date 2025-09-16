import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiValidateEmployee } from "@/utils/validators";
import { ApiResponse } from "@/utils/EmployeeTypes";

// GET single employee
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: params.id },
    });

    if (!employee) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<typeof employee>>({
      success: true,
      data: employee,
    });
  } catch (error: any) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update employee
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const errors = apiValidateEmployee(body, true);

    if (errors.length > 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, errors },
        { status: 400 }
      );
    }

    const updated = await prisma.employee.update({
      where: { id: params.id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        age: body.age,
        joiningDate: new Date(body.joiningDate),
        address: body.address,
        mobile: body.mobile,
      },
    });

    return NextResponse.json<ApiResponse<typeof updated>>({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE employee
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.employee.delete({
      where: { id: params.id },
    });

    return NextResponse.json<ApiResponse<null>>({
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
