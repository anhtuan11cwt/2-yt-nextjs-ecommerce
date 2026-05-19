import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import OrderModel from "@/models/order.model";

// API xóa đơn hàng (soft delete)
export async function DELETE(request) {
  try {
    await connectDB();
    await isAuthenticated("admin");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Thiếu mã đơn hàng", success: false },
        { status: 400 },
      );
    }

    const order = await OrderModel.findByIdAndUpdate(id, {
      deletedAt: new Date(),
    });

    if (!order) {
      return NextResponse.json(
        { message: "Không tìm thấy đơn hàng", success: false },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Xóa đơn hàng thành công",
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 },
    );
  }
}
