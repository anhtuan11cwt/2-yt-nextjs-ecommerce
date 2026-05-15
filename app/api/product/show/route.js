import { NextResponse } from "next/server";

import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import Product from "@/models/product.model";

// Parse tham số sắp xếp từ MRT
function parseSort(sortingParam) {
	try {
		const arr = JSON.parse(sortingParam || "[]");
		const first = Array.isArray(arr) ? arr[0] : null;
		if (!first?.id) {
			return { createdAt: -1 };
		}
		const map = {
			createdAt: "createdAt",
			discountPercent: "discountPercent",
			mrp: "mrp",
			name: "name",
			sellingPrice: "sellingPrice",
			slug: "slug",
		};
		const field = map[first.id];
		if (!field) {
			return { createdAt: -1 };
		}
		return { [field]: first.desc ? -1 : 1 };
	} catch {
		return { createdAt: -1 };
	}
}

// API danh sách sản phẩm với aggregation
export async function GET(request) {
	try {
		await isAuthenticated("admin");
		await connectDB();

		const { searchParams } = new URL(request.url);
		const page = Number.parseInt(searchParams.get("page") || "1", 10);
		const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
		const globalFilter = (searchParams.get("globalFilter") || "").trim();
		const deleteType = searchParams.get("deleteType") || "SD";
		const sortingParam = searchParams.get("sorting") || "[]";

		const matchStage = {};
		if (deleteType === "SD") {
			matchStage.deletedAt = null;
		} else {
			matchStage.deletedAt = { $ne: null };
		}

		const pipelineBase = [
			{ $match: matchStage },
			{
				$lookup: {
					as: "category",
					foreignField: "_id",
					from: "categories",
					localField: "category",
				},
			},
			{ $unwind: "$category" },
			{
				$lookup: {
					as: "media",
					foreignField: "_id",
					from: "media",
					localField: "media",
				},
			},
		];

		if (globalFilter) {
			const escaped = globalFilter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
			const regex = new RegExp(escaped, "i");
			const num = Number.parseFloat(globalFilter);
			const or = [{ name: regex }, { slug: regex }, { "category.name": regex }];
			if (Number.isFinite(num)) {
				or.push({ discountPercent: num });
				or.push({ mrp: num });
				or.push({ sellingPrice: num });
			}
			pipelineBase.push({ $match: { $or: or } });
		}

		const sortObj = parseSort(sortingParam);

		const pipeline = [
			...pipelineBase,
			{
				$facet: {
					data: [
						{ $sort: sortObj },
						{ $skip: (page - 1) * limit },
						{ $limit: limit },
					],
					total: [{ $count: "count" }],
				},
			},
		];

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
			{ status: error?.statusCode || 500 },
		);
	}
}
