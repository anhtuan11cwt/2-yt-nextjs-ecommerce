import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnection";
import { response } from "@/lib/helpers";
import OTP from "@/models/OTP.model";

// API xác thực OTP đặt lại mật khẩu, trả về reset token
export async function POST(req) {
	try {
		await connectDB();

		const body = await req.json();
		const { email, otp } = body;

		if (!email || !otp) {
			return response({
				message: "Email và OTP là bắt buộc",
				statusCode: 400,
				success: false,
			});
		}

		const otpRecord = await OTP.findOne({ email, otp });

		if (!otpRecord) {
			return response({
				message: "Mã OTP không hợp lệ hoặc đã hết hạn",
				statusCode: 400,
				success: false,
			});
		}

		const secret = new TextEncoder().encode(process.env.JWT_SECRET);
		const resetToken = await new SignJWT({
			email,
			purpose: "reset-password",
		})
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime("10m")
			.sign(secret);

		await OTP.deleteMany({ email });

		return NextResponse.json(
			{
				data: { email, token: resetToken },
				message: "Xác thực OTP thành công",
				success: true,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error(error);
		return response({
			message: "Lỗi máy chủ nội bộ",
			statusCode: 500,
			success: false,
		});
	}
}
