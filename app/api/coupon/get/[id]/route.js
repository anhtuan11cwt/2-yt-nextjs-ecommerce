import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectMongoDB from "@/lib/dbConnection";
import CouponModel from "@/models/coupon.model";

// API lấy mã giảm giá theo ID
export async function GET(_, { params }) {
	try {
		await connectMongoDB();
		await isAuthenticated("admin");

		const { id } = await params;

		const coupon = await CouponModel.findOne({ _id: id, deletedAt: null });

		if (!coupon) {
			return NextResponse.json(
				{ message: "Không tìm thấy mã giảm giá", success: false },
				{ status: 404 },
			);
		}

		return NextResponse.json({ coupon, success: true });
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, success: false },
			{ status: 500 },
		);
	}
}
