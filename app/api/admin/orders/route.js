import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import OrderModel from "@/models/order.model";

// API danh sách đơn hàng admin
export async function GET(request) {
	try {
		await connectDB();
		await isAuthenticated("admin");

		const { searchParams } = new URL(request.url);

		const page = Number.parseInt(searchParams.get("page") || "1", 10);
		const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
		const globalFilter = searchParams.get("globalFilter") || "";
		const deleteType = searchParams.get("deleteType") || "SD";

		const matchStage = {};

		if (deleteType === "SD") {
			matchStage.deletedAt = null;
		} else {
			matchStage.deletedAt = { $ne: null };
		}

		if (globalFilter) {
			const regex = new RegExp(globalFilter, "i");
			matchStage.$or = [
				{ "shippingAddress.name": regex },
				{ "shippingAddress.email": regex },
				{ "shippingAddress.phone": regex },
				{ "shippingAddress.state": regex },
				{ "shippingAddress.city": regex },
				{ "shippingAddress.pincode": regex },
				{ orderStatus: regex },
				{ couponCode: regex },
			];
		}

		const [orders, total] = await Promise.all([
			OrderModel.find(matchStage)
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit)
				.lean(),
			OrderModel.countDocuments(matchStage),
		]);

		return NextResponse.json({
			data: orders,
			success: true,
			total,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, success: false },
			{ status: 500 },
		);
	}
}
