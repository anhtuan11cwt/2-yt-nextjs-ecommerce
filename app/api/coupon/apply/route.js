import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnection";
import Coupon from "@/models/coupon.model";

// Áp dụng mã giảm giá — kiểm tra hạn, đơn tối thiểu và tính số tiền giảm
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { code, subtotal } = body;

    if (!code) {
      return NextResponse.json(
        { message: "Vui lòng nhập mã giảm giá", success: false },
        { status: 400 },
      );
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      deletedAt: null,
    });

    if (!coupon) {
      return NextResponse.json(
        { message: "Mã giảm giá không hợp lệ", success: false },
        { status: 404 },
      );
    }

    if (new Date(coupon.validity) < new Date()) {
      return NextResponse.json(
        { message: "Mã giảm giá đã hết hạn", success: false },
        { status: 400 },
      );
    }

    if (subtotal < coupon.minimumShoppingAmount) {
      return NextResponse.json(
        {
          message: `Đơn hàng tối thiểu ${coupon.minimumShoppingAmount}đ`,
          success: false,
        },
        { status: 400 },
      );
    }

    const couponDiscountAmount = (subtotal * coupon.discountPercent) / 100;

    return NextResponse.json({
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        discountPercent: coupon.discountPercent,
      },
      couponDiscountAmount,
      success: true,
    });
  } catch (_error) {
    return NextResponse.json(
      { message: "Lỗi máy chủ", success: false },
      { status: 500 },
    );
  }
}
