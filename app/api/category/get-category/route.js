import { NextResponse } from "next/server";

import connectDB from "@/lib/dbConnection";
import Category from "@/models/category.model";

// API lấy danh sách danh mục cho bộ lọc
export async function GET() {
	try {
		await connectDB();

		const categories = await Category.find({ deletedAt: null }).sort({
			createdAt: -1,
		});

		return NextResponse.json({
			categories,
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, success: false },
			{ status: 500 },
		);
	}
}
