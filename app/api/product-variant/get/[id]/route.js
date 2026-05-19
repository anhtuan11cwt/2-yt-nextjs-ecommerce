import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import ProductVariant from "@/models/productVariant.model";

// API lấy biến thể theo ID (có populate)
export async function GET(_request, { params }) {
  try {
    await isAuthenticated("admin");
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "ID biến thể không hợp lệ", success: false },
        { status: 400 },
      );
    }

    const oid = new mongoose.Types.ObjectId(id);

    const rows = await ProductVariant.aggregate([
      { $match: { _id: oid } },
      {
        $lookup: {
          as: "product",
          foreignField: "_id",
          from: "products",
          localField: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          as: "media",
          foreignField: "_id",
          from: "media",
          localField: "media",
        },
      },
    ]);

    const variant = rows[0] || null;

    if (!variant) {
      return NextResponse.json(
        { message: "Không tìm thấy biến thể", success: false },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: variant,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: error?.statusCode || 500 },
    );
  }
}
