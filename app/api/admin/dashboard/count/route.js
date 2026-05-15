import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectMongoDB from "@/lib/dbConnection";
import Category from "@/models/category.model";
import Order from "@/models/order.model";
import Product from "@/models/product.model";
import User from "@/models/User.model";

// API lấy số liệu thống kê dashboard
export async function GET() {
	try {
		await connectMongoDB();
		await isAuthenticated("admin");

		const [totalCategories, totalProducts, totalCustomers, totalOrders] =
			await Promise.all([
				Category.countDocuments({ deletedAt: null }),
				Product.countDocuments({ deletedAt: null }),
				User.countDocuments({ deletedAt: null, role: "user" }),
				Order.countDocuments({ deletedAt: null }),
			]);

		return NextResponse.json({
			data: {
				totalCategories,
				totalCustomers,
				totalOrders,
				totalProducts,
			},
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, success: false },
			{ status: 500 },
		);
	}
}
