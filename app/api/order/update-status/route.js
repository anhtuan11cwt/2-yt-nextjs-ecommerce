import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import OrderModel from "@/models/order.model";

// API cập nhật trạng thái đơn hàng (admin)
export async function PUT(request) {
  try {
    await connectDB();
    await isAuthenticated("admin");

    const { _id, status } = await request.json();

    if (!_id || !status) {
      return NextResponse.json(
        { message: "Thiếu mã đơn hàng hoặc trạng thái", success: false },
        { status: 400 },
      );
    }

    const order = await OrderModel.findById(_id);

    if (!order) {
      return NextResponse.json(
        { message: "Không tìm thấy đơn hàng", success: false },
        { status: 404 },
      );
    }

    order.orderStatus = status;
    await order.save();

    return NextResponse.json({
      message: "Cập nhật trạng thái thành công",
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 },
    );
  }
}
