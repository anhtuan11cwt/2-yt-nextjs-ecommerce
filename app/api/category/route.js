import { NextResponse } from "next/server";

import connectDB from "@/lib/dbConnection";
import Category from "@/models/category.model";

export async function GET(request) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (id) {
			const category = await Category.findById(id);
			return NextResponse.json({
				data: category,
				success: true,
			});
		}

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
			matchStage.$or = [{ name: regex }, { slug: regex }];
		}

		const [categories, total] = await Promise.all([
			Category.find(matchStage)
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit),
			Category.countDocuments(matchStage),
		]);

		return NextResponse.json({
			data: categories,
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
