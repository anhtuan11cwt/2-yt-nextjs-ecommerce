import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectMongoDB from "@/lib/dbConnection";
import CouponModel from "@/models/coupon.model";
import { createCouponSchema } from "@/validators/coupon.validator";

export async function PUT(request) {
	try {
		await connectMongoDB();
		await isAuthenticated("admin");

		const body = await request.json();
		const { id } = body;

		const validatedData = createCouponSchema.parse({
			...body,
			discountPercent: Number(body.discountPercent),
			minimumShoppingAmount: Number(body.minimumShoppingAmount),
		});

		const updatedCoupon = await CouponModel.findByIdAndUpdate(
			id,
			{
				...validatedData,
				code: validatedData.code.toUpperCase(),
			},
			{
				new: true,
			},
		);

		return NextResponse.json({
			coupon: updatedCoupon,
			message: "Cập nhật mã giảm giá thành công",
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error?.errors?.[0]?.message || error.message, success: false },
			{ status: 500 },
		);
	}
}
