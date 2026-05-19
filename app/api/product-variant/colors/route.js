import { NextResponse } from "next/server";

import connectDB from "@/lib/dbConnection";
import ProductVariant from "@/models/productVariant.model";

// API lấy danh sách màu sắc duy nhất
export async function GET() {
  try {
    await connectDB();

    const colors = await ProductVariant.distinct("color");

    return NextResponse.json({
      colors,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 },
    );
  }
}
