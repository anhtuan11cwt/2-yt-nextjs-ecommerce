import { NextResponse } from "next/server";

import connectDB from "@/lib/dbConnection";
import ProductVariant from "@/models/productVariant.model";

// API lấy danh sách sizes theo thứ tự logic (S, M, L, XL, 2XL)
export async function GET() {
	try {
		await connectDB();

		const sizes = await ProductVariant.aggregate([
			{
				$group: {
					_id: "$size",
				},
			},
			{
				$addFields: {
					sortOrder: {
						$switch: {
							branches: [
								// biome-ignore lint/suspicious/noThenProperty: MongoDB aggregation syntax
								{ case: { $eq: ["$_id", "S"] }, then: 1 },
								// biome-ignore lint/suspicious/noThenProperty: MongoDB aggregation syntax
								{ case: { $eq: ["$_id", "M"] }, then: 2 },
								// biome-ignore lint/suspicious/noThenProperty: MongoDB aggregation syntax
								{ case: { $eq: ["$_id", "L"] }, then: 3 },
								// biome-ignore lint/suspicious/noThenProperty: MongoDB aggregation syntax
								{ case: { $eq: ["$_id", "XL"] }, then: 4 },
								// biome-ignore lint/suspicious/noThenProperty: MongoDB aggregation syntax
								{ case: { $eq: ["$_id", "2XL"] }, then: 5 },
							],
							default: 99,
						},
					},
				},
			},
			{
				$sort: {
					sortOrder: 1,
				},
			},
			{
				$project: {
					_id: 0,
					size: "$_id",
				},
			},
		]);

		return NextResponse.json({
			sizes,
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, success: false },
			{ status: 500 },
		);
	}
}
