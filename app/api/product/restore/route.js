import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import Product from "@/models/product.model";

// API khôi phục sản phẩm đã xóa mềm
export async function PUT(request) {
  try {
    await isAuthenticated("admin");
    await connectDB();

    const body = await request.json();
    const ids = Array.isArray(body?.ids) ? body.ids : [];

    if (ids.length === 0) {
      return NextResponse.json(
        { message: "Thiếu danh sách ID", success: false },
        { status: 400 },
      );
    }

    const objectIds = ids
      .filter((x) => mongoose.Types.ObjectId.isValid(x))
      .map((x) => new mongoose.Types.ObjectId(x));

    await Product.updateMany({ _id: { $in: objectIds } }, { deletedAt: null });

    return NextResponse.json({
      message: "Khôi phục sản phẩm thành công",
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: error?.statusCode || 500 },
    );
  }
}
