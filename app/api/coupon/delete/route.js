import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectMongoDB from "@/lib/dbConnection";
import CouponModel from "@/models/coupon.model";

// API xóa mã giảm giá (soft delete)
export async function DELETE(request) {
	try {
		await connectMongoDB();
		await isAuthenticated("admin");

		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		await CouponModel.findByIdAndUpdate(id, {
			deletedAt: new Date(),
		});

		return NextResponse.json({
			message: "Xóa mã giảm giá thành công",
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, success: false },
			{ status: 500 },
		);
	}
}
