import bcryptjs from "bcryptjs";
import { jwtVerify } from "jose";
import connectDB from "@/lib/dbConnection";
import { response } from "@/lib/helpers";
import User from "@/models/User.model";

// API cập nhật mật khẩu mới với reset token
export async function PUT(req) {
	try {
		await connectDB();

		const body = await req.json();
		const { token, password } = body;

		if (!token || !password) {
			return response({
				message: "Token và mật khẩu là bắt buộc",
				statusCode: 400,
				success: false,
			});
		}

		let decoded;
		try {
			const secret = new TextEncoder().encode(process.env.JWT_SECRET);
			const { payload } = await jwtVerify(token, secret);
			decoded = payload;
		} catch (_error) {
			return response({
				message: "Token không hợp lệ hoặc đã hết hạn",
				statusCode: 401,
				success: false,
			});
		}

		if (decoded.purpose !== "reset-password") {
			return response({
				message: "Token không hợp lệ",
				statusCode: 401,
				success: false,
			});
		}

		const user = await User.findOne({
			deletedAt: null,
			email: decoded.email,
		}).select("+password");

		if (!user) {
			return response({
				message: "Không tìm thấy người dùng",
				statusCode: 404,
				success: false,
			});
		}

		const salt = await bcryptjs.genSalt(10);
		const hashedPassword = await bcryptjs.hash(password, salt);
		user.password = hashedPassword;
		await user.save();

		return response({
			data: null,
			message: "Cập nhật mật khẩu thành công",
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
