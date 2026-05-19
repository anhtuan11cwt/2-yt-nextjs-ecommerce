import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import OrderModel from "@/models/order.model";

// API doanh thu theo tháng
export async function GET() {
  try {
    await connectDB();
    await isAuthenticated("admin");

    const currentYear = new Date().getFullYear();

    const monthlySales = await OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
          deletedAt: null,
          orderStatus: { $in: ["Processing", "Shipped", "Delivered"] },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    return NextResponse.json({ data: monthlySales, success: true });
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 },
    );
  }
}
