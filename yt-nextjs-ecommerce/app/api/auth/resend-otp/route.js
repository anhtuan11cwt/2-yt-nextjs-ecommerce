import dbConnect from "@/lib/dbConnection";
import otpEmail from "@/lib/email/otpEmail";
import { generateOTP, response } from "@/lib/helpers";
import sendEmail from "@/lib/sendEmail";
import OTP from "@/models/OTP.model";
import User from "@/models/User.model";

export async function POST(req) {
	try {
		await dbConnect();
		const body = await req.json();
		const { email } = body;

		const user = await User.findOne({ deletedAt: null, email });

		if (!user) {
			return response({
				message: "Không tìm thấy người dùng",
				statusCode: 404,
				success: false,
			});
		}

		await OTP.deleteMany({ email });

		const otp = generateOTP();

		await OTP.create({ email, otp });

		await sendEmail({
			html: otpEmail(otp),
			subject: "Gửi lại mã OTP",
			to: email,
		});

		return response({
			message: "OTP đã được gửi lại thành công",
			statusCode: 200,
			success: true,
		});
	} catch (error) {
		console.error(error);
		return response({
			message: "Lỗi máy chủ nội bộ",
			statusCode: 500,
			success: false,
		});
	}
}
