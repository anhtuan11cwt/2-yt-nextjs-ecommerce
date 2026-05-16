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

		// Lấy toàn bộ đơn hàng của user
		const orders = await OrderModel.find({ user: userId })
			.sort({ createdAt: -1 })
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

		return NextResponse.json({
			data: orders,
			message: "Danh sách đơn hàng",
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
