import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnection";
import ReviewModel from "@/models/review-model";

export async function POST(request) {
	try {
		await connectDB();
		const body = await request.json();

		if (!body.userId) {
			return NextResponse.json(
				{ message: "Thiếu ID người dùng", success: false },
				{ status: 400 },
			);
		}

		const review = await ReviewModel.create(body);

		return NextResponse.json({
			message: "Đánh giá đã được gửi thành công",
			review,
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: `Đã xảy ra lỗi: ${error.message}`, success: false },
			{ status: 500 },
		);
	}
}
