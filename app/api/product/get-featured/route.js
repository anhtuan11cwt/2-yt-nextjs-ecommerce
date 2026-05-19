import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnection";
import Product from "@/models/product.model";

// Lấy ngẫu nhiên 8 sản phẩm nổi bật cho trang chủ
export async function GET() {
  try {
    await connectDB();

    const products = await Product.aggregate([
      { $match: { deletedAt: null } },
      { $sample: { size: 8 } },
      {
        $lookup: {
          as: "media",
          foreignField: "_id",
          from: "media",
          localField: "media",
        },
      },
    ]);

    return NextResponse.json({
      products,
      success: true,
    });
  } catch (_error) {
    return NextResponse.json(
      { message: "Không thể lấy sản phẩm nổi bật", success: false },
      { status: 500 },
    );
  }
}
