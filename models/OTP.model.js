import mongoose from "mongoose";

// Schema lưu mã OTP với TTL tự động xóa
const otpSchema = new mongoose.Schema(
	{
		email: {
			lowercase: true,
			required: true,
			trim: true,
			type: String,
		},

		expiresAt: {
			default: () => Date.now() + 10 * 60 * 1000,
			type: Date,
		},

		otp: {
			required: true,
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

// Index TTL tự động xóa OTP hết hạn
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.models.OTP || mongoose.model("OTP", otpSchema);

export default OTP;
