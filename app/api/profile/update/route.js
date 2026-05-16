import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import UserModel from "@/models/User.model";

export async function PUT(req) {
	try {
		await connectDB();
		const user = await isAuthenticated();
		const userId = user._id;
		const body = await req.json();

		const updatedUser = await UserModel.findByIdAndUpdate(
			userId,
			{
				address: body.address,
				name: body.name,
				phone: body.phone,
			},
			{ new: true },
		).lean();

		return NextResponse.json({
			data: updatedUser,
			message: "Cập nhật hồ sơ thành công",
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
