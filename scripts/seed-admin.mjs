import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, "../.env"), quiet: true });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error("Vui lòng định nghĩa biến MONGODB_URI trong file .env");
}

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

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function seedAdmin() {
	try {
		await mongoose.connect(MONGODB_URI);

		const existingAdmin = await User.findOne({
			deletedAt: null,
			role: "admin",
		});

		if (existingAdmin) {
			console.log("Đã tồn tại tài khoản admin, bỏ qua seed.");
			await mongoose.disconnect();
			return;
		}

		const hashedPassword = await bcrypt.hash("Admin123!", 10);

		await User.create({
			address: "",
			email: "admin@shop.com",
			isEmailVerified: true,
			name: "Admin",
			password: hashedPassword,
			phone: "",
			role: "admin",
		});

		console.log("Đã tạo tài khoản admin mặc định:");
		console.log("   Email: admin@shop.com");
		console.log("   Password: Admin123!");
	} catch (error) {
		console.error("Lỗi seed admin:", error.message);
	} finally {
		await mongoose.disconnect();
	}
}

seedAdmin();
