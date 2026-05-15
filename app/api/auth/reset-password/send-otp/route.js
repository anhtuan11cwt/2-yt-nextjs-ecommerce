import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnection";
import otpEmail from "@/lib/email/otpEmail";
import { generateOTP, response } from "@/lib/helpers";
import sendEmail from "@/lib/sendEmail";
import OTP from "@/models/OTP.model";
import User from "@/models/User.model";

// API gửi OTP đặt lại mật khẩu
export async function POST(req) {
	try {
		await connectDB();

		const body = await req.json();
		const { email } = body;

		if (!email) {
			return response({
				message: "Email là bắt buộc",
				statusCode: 400,
				success: false,
			});
		}

		const existingUser = await User.findOne({ deletedAt: null, email });

		if (!existingUser) {
			return response({
				message: "Không tìm thấy tài khoản với email này",
				statusCode: 404,
				success: false,
			});
		}

		await OTP.deleteMany({ email });

		const otp = generateOTP();

		await OTP.create({ email, otp });

		await sendEmail({
			html: otpEmail(otp),
			subject: "Mã OTP đặt lại mật khẩu",
			to: email,
		});

		return NextResponse.json(
			{
				message: "Mã OTP đã được gửi đến email của bạn",
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
