import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import MediaModel from "@/models/media.model";
import OrderModel from "@/models/order.model";
import ProductModel from "@/models/product.model";
import ProductVariantModel from "@/models/productVariant.model";

export async function GET() {
	try {
		await connectDB();
		const user = await isAuthenticated();
		const userId = user._id;

		// Đơn hàng gần đây
		const recentOrders = await OrderModel.find({ user: userId })
			.sort({ createdAt: -1 })
			.limit(10)
			.populate({
				model: ProductModel,
				path: "products.product",
				select: "name slug",
			})
			.populate({
				model: ProductVariantModel,
				path: "products.variant",
				populate: {
					model: MediaModel,
					path: "media",
					select: "secure_url",
				},
			})
			.lean();

		// Tổng đơn hàng
		const totalOrder = await OrderModel.countDocuments({ user: userId });

		return NextResponse.json({
			data: {
				recentOrders,
				totalOrder,
			},
			message: "Thông tin bảng điều khiển",
			status: 200,
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{
				message: error.message,
				status: 500,
				success: false,
			},
			{ status: 500 },
		);
	}
}
