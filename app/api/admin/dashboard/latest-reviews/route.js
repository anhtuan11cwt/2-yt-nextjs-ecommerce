import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import MediaModel from "@/models/media.model";
import ReviewModel from "@/models/review.model";

// API 6 đánh giá mới nhất
export async function GET() {
	try {
		await connectDB();
		await isAuthenticated("admin");

		const latestReviews = await ReviewModel.find()
			.sort({ createdAt: -1 })
			.limit(6)
			.populate({
				path: "productId",
				populate: {
					model: MediaModel,
					path: "media",
					select: "secure_url",
				},
				select: "name media",
			})
			.populate({
				path: "userId",
				select: "name",
			})
			.lean();

		return NextResponse.json({ data: latestReviews, success: true });
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, success: false },
			{ status: 500 },
		);
	}
}
