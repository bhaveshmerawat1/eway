import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
import * as multipart from "parse-multipart-data";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.startsWith("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    // Extract boundary from content-type
    const boundaryMatch = contentType.match(/boundary=(.+)$/);
    if (!boundaryMatch) {
      return NextResponse.json({ error: "No boundary found" }, { status: 400 });
    }
    const boundary = boundaryMatch[1];

    // Convert request to buffer
    const buffer = Buffer.from(await req.arrayBuffer());

    // Parse form-data
    const parts = multipart.parse(buffer, boundary);

    // Map fields
    const fields: Record<string, string> = {};
    let file: any = null;

    for (const part of parts) {
      if (part.filename) {
        file = part;
      } else {
        //@ts-ignore
        fields[part.name] = part.data.toString();
      }
    }

    const { name, description, price, size } = fields;

    if (!name || !price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    // Save file if uploaded
    let imageUrl = "";
    if (file) {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      fs.mkdirSync(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, file.filename);
      fs.writeFileSync(filePath, file.data);
      imageUrl = `/uploads/${file.filename}`;
    }

    // Save product in SQLite (via Prisma)
    const product = await prisma.product.create({
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
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
