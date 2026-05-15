import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectMongoDB from "@/lib/dbConnection";
import ReviewModel from "@/models/review.model";

export async function GET(request) {
	try {
		await connectMongoDB();
		await isAuthenticated("admin");

		const { searchParams } = new URL(request.url);
		const page = Number(searchParams.get("page")) || 1;
		const limit = Number(searchParams.get("limit")) || 10;
		const search = searchParams.get("search") || "";
		const sortField = searchParams.get("sortField") || "createdAt";
		const sortOrder = searchParams.get("sortOrder") || "desc";
		const isTrash = searchParams.get("trash") === "true";
		const rating = searchParams.get("rating");

		const skip = (page - 1) * limit;
		const filter = {};

		if (isTrash) {
			filter.deletedAt = { $ne: null };
		} else {
			filter.deletedAt = null;
		}

		if (rating) {
			filter.rating = Number(rating);
		}

		if (search) {
			filter.$or = [
				{ title: { $options: "i", $regex: search } },
				{ content: { $options: "i", $regex: search } },
			];
		}

		const pipeline = [
			{ $match: filter },
			{
				$lookup: {
					as: "product",
					foreignField: "_id",
					from: "products",
					localField: "product",
				},
			},
			{ $unwind: "$product" },
			{
				$lookup: {
					as: "user",
					foreignField: "_id",
					from: "users",
					localField: "user",
				},
			},
			{ $unwind: "$user" },
			{ $sort: { [sortField]: sortOrder === "asc" ? 1 : -1 } },
			{ $skip: skip },
			{ $limit: limit },
			{
				$project: {
					content: 1,
					createdAt: 1,
					deletedAt: 1,
					"product.name": 1,
					rating: 1,
					title: 1,
					"user.email": 1,
					"user.name": 1,
				},
			},
		];

		const reviews = await ReviewModel.aggregate(pipeline);
		const total = await ReviewModel.countDocuments(filter);

		return NextResponse.json({
			data: reviews,
			pagination: {
				limit,
				page,
				pages: Math.ceil(total / limit),
				total,
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
