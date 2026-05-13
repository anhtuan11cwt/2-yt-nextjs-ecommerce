import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import connectDB from "@/lib/dbConnection";
import emailVerificationLink from "@/lib/email/emailVerificationLink";
import { response } from "@/lib/helpers";
import sendEmail from "@/lib/sendEmail";
import User from "@/models/User.model";
import { registerSchema } from "@/validators/auth.validator";

export async function POST(request) {
	try {
		await connectDB();

		const body = await request.json();

		const validated = registerSchema.safeParse(body);

		if (!validated.success) {
			return response({
				message: validated.error.issues[0]?.message || "Xác thực thất bại",
				statusCode: 400,
				success: false,
			});
		}

		const { name, email, password } = validated.data;

		const existingUser = await User.exists({ email });

		if (existingUser) {
			return response({
				message: "Email đã tồn tại",
				statusCode: 409,
				success: false,
			});
		}

		// Hash mật khẩu thủ công tại đây
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			email,
			name,
			password: hashedPassword,
		});

		// JWT Token
		const secret = new TextEncoder().encode(process.env.JWT_SECRET);

		const verificationToken = await new SignJWT({ userId: user._id.toString() })
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime("1h")
			.sign(secret);

		// Verify URL
		const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email/${verificationToken}`;

		// Send email
		await sendEmail({
			html: emailVerificationLink({
				name: user.name,
				verificationUrl,
			}),
			subject: "Xác Thực Email Của Bạn",
			to: user.email,
		});

		return response({
			message: "Đăng ký thành công. Email xác thực đã được gửi.",
			statusCode: 201,
			success: true,
		});
	} catch (error) {
		// Duplicate email
		if (error.code === 11000) {
			return response({
				message: "Email đã tồn tại",
				statusCode: 409,
				success: false,
			});
		}

		return response({
			message:
				process.env.NODE_ENV === "development"
					? error.message
					: "Lỗi máy chủ nội bộ",
			statusCode: 500,
			success: false,
		});
	}
}
