import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// Schema người dùng (admin/user)
const userSchema = new mongoose.Schema(
	{
		address: { default: "", type: String },
		avatar: {
			publicId: { default: "", type: String },
			url: { default: "", type: String },
		},
		deletedAt: { default: null, type: Date },
		email: {
			lowercase: true,
			required: true,
			trim: true,
			type: String,
			unique: true,
		},
		isEmailVerified: { default: false, type: Boolean },
		name: { required: true, trim: true, type: String },
		password: { required: true, select: false, type: String },
		phone: { default: "", type: String },
		role: { default: "user", enum: ["admin", "user"], type: String },
	},
	{ timestamps: true },
);

// So sánh mật khẩu với hash
userSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
