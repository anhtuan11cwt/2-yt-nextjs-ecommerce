import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnection";
import verifyEmailLink from "@/lib/email/emailVerificationLink";
import otpEmail from "@/lib/email/otpEmail";
import { comparePassword, generateOTP, response } from "@/lib/helpers";
import sendEmail from "@/lib/sendEmail";
import OTP from "@/models/OTP.model";
import User from "@/models/User.model";
import { loginSchema } from "@/validators/auth.validator";

// API đăng nhập: kiểm tra email/mật khẩu, gửi OTP (user) hoặc tạo token trực tiếp (admin)
export async function POST(req) {
	try {
		await dbConnect();
		const body = await req.json();
		const validatedData = loginSchema.parse(body);
		const { email, password } = validatedData;

		const user = await User.findOne({
			deletedAt: null,
			email,
		}).select("+password");

		if (!user) {
			return response({
				message: "Email hoặc mật khẩu không hợp lệ",
				statusCode: 400,
				success: false,
			});
		}

		// Yêu cầu xác thực email trước khi đăng nhập
		if (!user.isEmailVerified) {
			await sendEmail({
				html: verifyEmailLink({
					name: user.name,
					verificationUrl: "VERIFY_TOKEN_PLACEHOLDER",
				}),
				subject: "Xác thực email của bạn",
				to: user.email,
			});

			return response({
				message: "Vui lòng xác thực email trước",
				statusCode: 403,
				success: false,
			});
		}

		const isPasswordMatched = await comparePassword(password, user.password);

		if (!isPasswordMatched) {
			return response({
				message: "Email hoặc mật khẩu không hợp lệ",
				statusCode: 400,
				success: false,
			});
		}

		// Admin: tạo token trực tiếp, không cần OTP
		if (user.role === "admin") {
			const tokenPayload = {
				_id: user._id.toString(),
				email: user.email,
				name: user.name,
				role: user.role,
			};

			const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
				expiresIn: "24h",
			});

			const cookieStore = await cookies();
			cookieStore.set("access_token", token, {
				httpOnly: true,
				maxAge: 60 * 60 * 24,
				path: "/",
				sameSite: "strict",
			});

			return response({
				data: {
					token,
					user: {
						_id: user._id.toString(),
						email: user.email,
						name: user.name,
						role: user.role,
					},
				},
				message: "Đăng nhập thành công",
				statusCode: 200,
				success: true,
			});
		}

		// User: gửi OTP xác thực
		await OTP.deleteMany({ email: user.email });

		const otp = generateOTP();

		await OTP.create({
			email: user.email,
			otp,
		});

		await sendEmail({
			html: otpEmail(otp),
			subject: "Mã OTP đăng nhập của bạn",
			to: user.email,
		});

		return response({
			message: "OTP đã được gửi thành công",
			statusCode: 200,
			success: true,
		});
	} catch (_error) {
		return response({
			message: "Lỗi máy chủ nội bộ",
			statusCode: 500,
			success: false,
		});
	}
}
