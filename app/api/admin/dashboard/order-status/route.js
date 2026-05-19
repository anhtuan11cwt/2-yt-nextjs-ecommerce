import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import OrderModel from "@/models/order.model";

// API phân bố trạng thái đơn hàng
export async function GET() {
  try {
    await connectDB();
    await isAuthenticated("admin");

    const statusDistribution = await OrderModel.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return NextResponse.json({ data: statusDistribution, success: true });
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 },
    );
  }
}
