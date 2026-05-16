import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import UserModel from "@/models/User.model";

export async function GET() {
	try {
		await connectDB();
		const user = await isAuthenticated();
		const userId = user._id;

		const userData = await UserModel.findById(userId).lean();

		if (!userData) {
			return NextResponse.json(
				{ message: "Không tìm thấy người dùng", status: 404, success: false },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			data: userData,
			message: "Thông tin hồ sơ",
			status: 200,
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, status: 500, success: false },
			{ status: 500 },
		);
	}
}
