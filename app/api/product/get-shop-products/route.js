import { NextResponse } from "next/server";

import connectDB from "@/lib/dbConnection";
import Product from "@/models/product.model";

// API lấy sản phẩm cho trang Shop với bộ lọc
export async function GET(request) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const category = searchParams.get("category") || "";
		const color = searchParams.get("color") || "";
		const size = searchParams.get("size") || "";
		const min = Number(searchParams.get("min")) || 100;
		const max = Number(searchParams.get("max")) || 5000;
		const page = Number.parseInt(searchParams.get("page") || "1", 10);
		const limit = Number.parseInt(searchParams.get("limit") || "12", 10);

		const pipeline = [
			{ $match: { deletedAt: null } },
			{
				$lookup: {
					as: "category",
					foreignField: "_id",
					from: "categories",
					localField: "category",
				},
			},
			{ $unwind: "$category" },
			{ $match: { "category.deletedAt": null } },
			{
				$lookup: {
					as: "variants",
					foreignField: "product",
					from: "productvariants",
					localField: "_id",
					pipeline: [{ $match: { deletedAt: null } }],
				},
			},
			{
				$lookup: {
					as: "media",
					foreignField: "_id",
					from: "media",
					localField: "media",
				},
			},
		];

		// Lọc theo category slug
		if (category) {
			const categorySlugs = category.split(",");
			pipeline.push({
				$match: { "category.slug": { $in: categorySlugs } },
			});
		}

		// Lọc theo color
		if (color) {
			const colors = color.split(",");
			pipeline.push({
				$match: { "variants.color": { $in: colors } },
			});
		}

		// Lọc theo size
		if (size) {
			const sizes = size.split(",");
			pipeline.push({
				$match: { "variants.size": { $in: sizes } },
			});
		}

		// Lọc theo khoảng giá
		pipeline.push({
			$match: {
				sellingPrice: { $gte: min, $lte: max },
			},
		});

		// Đếm tổng và phân trang
		pipeline.push({
			$facet: {
				data: [
					{ $sort: { createdAt: -1 } },
					{ $skip: (page - 1) * limit },
					{ $limit: limit },
				],
				total: [{ $count: "count" }],
			},
		});

		const [result] = await Product.aggregate(pipeline);
		const data = result?.data || [];
		const total = result?.total?.[0]?.count || 0;

		return NextResponse.json({
			data,
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
