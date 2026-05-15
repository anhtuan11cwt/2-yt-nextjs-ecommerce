import { NextResponse } from "next/server";

import connectDB from "@/lib/dbConnection";
import Product from "@/models/product.model";

// API shop với sorting, phân trang và filter variants
export async function GET(request) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);

		const page = Number(searchParams.get("page")) || 1;
		const limit = Number(searchParams.get("limit")) || 12;
		const sort = searchParams.get("sort") || "default";

		const category = searchParams.get("category");
		const color = searchParams.get("color");
		const size = searchParams.get("size");

		const minPrice = Number(searchParams.get("minPrice")) || 0;
		const maxPrice = Number(searchParams.get("maxPrice")) || 999999;

		const q = searchParams.get("q");

		const skip = (page - 1) * limit;

		// Match stage
		const matchStage = { deletedAt: null };

		if (q) {
			matchStage.name = { $options: "i", $regex: q };
		}

		matchStage.sellingPrice = { $gte: minPrice, $lte: maxPrice };

		// Sort stage
		const sortStage = {};

		switch (sort) {
			case "asc":
				sortStage.name = 1;
				break;
			case "desc":
				sortStage.name = -1;
				break;
			case "price-low-high":
				sortStage.sellingPrice = 1;
				break;
			case "price-high-low":
				sortStage.sellingPrice = -1;
				break;
			default:
				sortStage.createdAt = -1;
		}

		const pipeline = [
			{ $match: matchStage },
			{ $sort: sortStage },
			{ $skip: skip },
			{ $limit: limit + 1 },

			// Lookup category
			{
				$lookup: {
					as: "category",
					foreignField: "_id",
					from: "categories",
					localField: "category",
				},
			},
			{ $unwind: "$category" },

			// Lọc theo category slug
			...(category
				? [
						{
							$match: {
								"category.slug": { $in: category.split(",") },
							},
						},
					]
				: []),

			// Lookup variants
			{
				$lookup: {
					as: "variants",
					foreignField: "product",
					from: "productvariants",
					localField: "_id",
					pipeline: [{ $match: { deletedAt: null } }],
				},
			},

			// Lookup media
			{
				$lookup: {
					as: "media",
					foreignField: "_id",
					from: "media",
					localField: "media",
				},
			},

			// Filter variants theo color/size
			{
				$addFields: {
					variants: {
						$filter: {
							as: "variant",
							cond: {
								$and: [
									color ? { $eq: ["$$variant.color", color] } : true,
									size ? { $eq: ["$$variant.size", size] } : true,
								],
							},
							input: "$variants",
						},
					},
				},
			},

			// Loại sản phẩm không có variants khớp
			{ $match: { variants: { $ne: [] } } },

			// Project
			{
				$project: {
					discountPercent: 1,
					media: 1,
					mrp: 1,
					name: 1,
					sellingPrice: 1,
					slug: 1,
					variants: 1,
				},
			},
		];

		const products = await Product.aggregate(pipeline);

		const hasNextPage = products.length > limit;

		if (hasNextPage) {
			products.pop();
		}

		return NextResponse.json({
			nextPage: hasNextPage ? page + 1 : null,
			products,
		});
	} catch (error) {
		console.log(error);

		return NextResponse.json(
			{ message: "Lỗi máy chủ nội bộ" },
			{ status: 500 },
		);
	}
}
