import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnection";
import ReviewModel from "@/models/review-model";
import UserModel from "@/models/User.model";

export async function GET(request) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const productId = searchParams.get("productId");
		const page = Number(searchParams.get("page")) || 1;
		const limit = Number(searchParams.get("limit")) || 5;
		const skip = (page - 1) * limit;

		if (!productId) {
			return NextResponse.json(
				{ message: "Thiếu productId", success: false },
				{ status: 400 },
			);
		}

		const objectId = new mongoose.Types.ObjectId(productId);

		// Thống kê đánh giá
		const stats = await ReviewModel.aggregate([
			{ $match: { productId: objectId } },
			{
				$group: {
					_id: "$rating",
					count: { $sum: 1 },
				},
			},
		]);

		const totalReviews = stats.reduce((acc, item) => acc + item.count, 0);
		const totalRating = stats.reduce(
			(acc, item) => acc + item._id * item.count,
			0,
		);
		const averageRating =
			totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

		const ratingMap = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
		stats.forEach((item) => {
			if (ratingMap[item._id] !== undefined) {
				ratingMap[item._id] = item.count;
			}
		});

		const percentages = {};
		Object.keys(ratingMap).forEach((rating) => {
			percentages[rating] =
				totalReviews > 0
					? Math.round((ratingMap[rating] / totalReviews) * 100)
					: 0;
		});

		// Danh sách đánh giá
		const reviews = await ReviewModel.find({ productId })
			.populate({
				model: UserModel,
				path: "userId",
				select: "name avatar",
			})
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		return NextResponse.json({
			reviews,
			success: true,
			summary: {
				averageRating,
				percentages,
				ratingMap,
				totalReviews,
			},
		});
	} catch (_error) {
		return NextResponse.json(
			{ message: "Đã xảy ra lỗi", success: false },
			{ status: 500 },
		);
	}
}
