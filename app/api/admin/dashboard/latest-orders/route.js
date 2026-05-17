import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import OrderModel from "@/models/order.model";

// API 10 đơn hàng mới nhất
export async function GET() {
	try {
		await connectDB();
		await isAuthenticated("admin");

		const latestOrders = await OrderModel.find({ deletedAt: null })
			.sort({ createdAt: -1 })
			.limit(10)
			.lean();

		return NextResponse.json({ data: latestOrders, success: true });
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, success: false },
			{ status: 500 },
		);
	}
}
