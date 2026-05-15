import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import UnauthorizedError from "@/errors/unauthorized-error";
import connectDB from "@/lib/dbConnection";
import UserModel from "@/models/User.model";

// Middleware xác thực: verify JWT và check role
export const isAuthenticated = async (role = "user") => {
	try {
		await connectDB();
		const cookieStore = await cookies();
		const accessToken = cookieStore.get("access_token")?.value;

		if (!accessToken) {
			throw new UnauthorizedError("Truy Cập Chưa Được Xác Thực");
		}

		const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

		if (!decoded?._id) {
			throw new UnauthorizedError("Token Không Hợp Lệ");
		}

		const user = await UserModel.findById(decoded._id);

		if (!user) {
			throw new UnauthorizedError("Không Tìm Thấy Người Dùng");
		}

		if (role && user.role !== role) {
			throw new UnauthorizedError("Quyền Truy Cập Bị Từ Chối");
		}

		return user;
	} catch (error) {
		throw new UnauthorizedError(
			error?.message || "Truy Cập Chưa Được Xác Thực",
		);
	}
};
