import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
import * as multipart from "parse-multipart-data";

// Update product
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.startsWith("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    // Extract boundary
    const boundaryMatch = contentType.match(/boundary=(.+)$/);
    if (!boundaryMatch) {
      return NextResponse.json({ error: "No boundary found" }, { status: 400 });
    }
    const boundary = boundaryMatch[1];

    // Convert request to buffer
    const buffer = Buffer.from(await req.arrayBuffer());

    // Parse form-data
    const parts = multipart.parse(buffer, boundary);

    const fields: Record<string, string> = {};
    let file: any = null;

    for (const part of parts) {
      if (part.filename) {
        file = part;
      } else {
        // @ts-ignore
        fields[part.name] = part.data.toString();
      }
    }

    const { name, description, price, size } = fields;

    if (!name || !price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    // Get current product
    const existing = await prisma.product.findUnique({ where: { id: id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Save new file (if uploaded)
    let imageUrl = existing.imageUrl;
    if (file) {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      fs.mkdirSync(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, file.filename);
      fs.writeFileSync(filePath, file.data);
      imageUrl = `/uploads/${file.filename}`;
    }

    // Update product in SQLite
    const product = await prisma.product.update({
      where: { id: id },
      data: {
        name,
        description: description || "",
        price: parseFloat(price),
        size: size || "",
        imageUrl,
      },
    });

    return NextResponse.json({ product });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// Delete product (optional)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.product.delete({ where: { id: id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
