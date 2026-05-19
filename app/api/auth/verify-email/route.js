import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnection";
import User from "@/models/User.model";

// API xác thực email qua JWT token
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Token không tồn tại", success: false },
        { status: 400 },
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const userId = payload.userId;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User không tồn tại", success: false },
        { status: 404 },
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email đã được xác thực", success: false },
        { status: 400 },
      );
    }

    user.isEmailVerified = true;
    await user.save();

    return NextResponse.json(
      { message: "Xác thực email thành công", success: true },
      { status: 200 },
    );
  } catch (_error) {
    return NextResponse.json(
      { message: "Token không hợp lệ hoặc đã hết hạn", success: false },
      { status: 500 },
    );
  }
}
