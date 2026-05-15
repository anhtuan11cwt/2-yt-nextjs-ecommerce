import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectMongoDB from "@/lib/dbConnection";
import CouponModel from "@/models/coupon.model";
import { createCouponSchema } from "@/validators/coupon.validator";

export async function POST(request) {
	try {
		await connectMongoDB();
		await isAuthenticated("admin");

		const body = await request.json();

		const validatedData = createCouponSchema.parse({
			...body,
			discountPercent: Number(body.discountPercent),
			minimumShoppingAmount: Number(body.minimumShoppingAmount),
		});

		const alreadyExists = await CouponModel.findOne({
			code: validatedData.code.toUpperCase(),
			deletedAt: null,
		});

		if (alreadyExists) {
			return NextResponse.json(
				{ message: "Mã giảm giá đã tồn tại", success: false },
				{ status: 409 },
			);
		}

		const coupon = await CouponModel.create({
			...validatedData,
			code: validatedData.code.toUpperCase(),
		});

		return NextResponse.json({
			coupon,
			message: "Tạo mã giảm giá thành công",
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error?.errors?.[0]?.message || error.message, success: false },
			{ status: 500 },
		);
	}
}
