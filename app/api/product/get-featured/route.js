import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnection";
import Product from "@/models/product.model";

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

		console.log(`Đã lấy sản phẩm nổi bật: ${products.length}`);

		return NextResponse.json({
			products,
			success: true,
		});
	} catch (error) {
		console.error("Lỗi khi lấy sản phẩm nổi bật:", error);
		return NextResponse.json(
			{ message: "Không thể lấy sản phẩm nổi bật", success: false },
			{ status: 500 },
		);
	}
}
