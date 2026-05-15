import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import CouponModel from "@/models/coupon.model";

// API danh sách mã giảm giá
export async function GET(request) {
	try {
		await connectDB();
		await isAuthenticated("admin");

		const { searchParams } = new URL(request.url);

		const page = Number.parseInt(searchParams.get("page") || "1", 10);
		const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
		const globalFilter = searchParams.get("globalFilter") || "";
		const deleteType = searchParams.get("deleteType") || "SD";

		const matchStage = {};

		if (deleteType === "SD") {
			matchStage.deletedAt = null;
		} else {
			matchStage.deletedAt = { $ne: null };
		}

		if (globalFilter) {
			const regex = new RegExp(globalFilter, "i");
			matchStage.$or = [{ code: regex }];
		}

		const [coupons, total] = await Promise.all([
			CouponModel.find(matchStage)
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit),
			CouponModel.countDocuments(matchStage),
		]);

		return NextResponse.json({
			data: coupons,
			success: true,
			total,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, success: false },
			{ status: 500 },
		);
	}
}
