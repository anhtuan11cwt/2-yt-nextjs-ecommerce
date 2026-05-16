import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnection";
import { response } from "@/lib/helpers";
import OTP from "@/models/OTP.model";
import User from "@/models/User.model";
import { verifyOtpSchema } from "@/validators/auth.validator";

// API xác thực OTP, tạo JWT access token
export async function POST(req) {
	try {
		await dbConnect();
		const body = await req.json();
		const validatedData = verifyOtpSchema.parse(body);
		const { email, otp } = validatedData;

		const otpRecord = await OTP.findOne({ email, otp });

		if (!otpRecord) {
			return response({
				message: "Mã OTP không hợp lệ hoặc đã hết hạn",
				statusCode: 400,
				success: false,
			});
		}

		const user = await User.findOne({ deletedAt: null, email });

		if (!user) {
			return response({
				message: "Không tìm thấy người dùng",
				statusCode: 404,
				success: false,
			});
		}

		const secret = new TextEncoder().encode(process.env.JWT_SECRET);
		const accessToken = await new SignJWT({
			_id: user._id.toString(),
			avatar: user.avatar,
			name: user.name,
			role: user.role,
		})
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime("24h")
			.sign(secret);

		const res = NextResponse.json(
			{
				data: {
					user: {
						_id: user._id,
						avatar: user.avatar,
						email: user.email,
						name: user.name,
						role: user.role,
					},
				},
				message: "Đăng nhập thành công",
				success: true,
			},
			{ status: 200 },
		);

		res.cookies.set("access_token", accessToken, {
			httpOnly: true,
			maxAge: 60 * 60 * 24,
			path: "/",
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
		});

		await OTP.deleteOne({ _id: otpRecord._id });

		return res;
	} catch (_error) {
		return response({
			message: "Lỗi máy chủ nội bộ",
			statusCode: 500,
			success: false,
		});
	}
}
