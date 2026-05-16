import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/dbConnection";
import UserModel from "@/models/User.model";

export async function PUT(request) {
	try {
		await connectDB();
		const authUser = await isAuthenticated();
		const userId = authUser._id;

		// Lấy FormData (không dùng .lean() vì cần .save())
		const user = await UserModel.findById(userId);
		if (!user) {
			return NextResponse.json(
				{ message: "Không tìm thấy người dùng", status: 404, success: false },
				{ status: 404 },
			);
		}

		const formData = await request.formData();
		const file = formData.get("file");
		const name = formData.get("name");
		const phone = formData.get("phone");
		const address = formData.get("address");

		// Cập nhật thông tin cơ bản
		if (name) user.name = name;
		if (phone) user.phone = phone;
		if (address) user.address = address;

		// Upload avatar nếu có file
		if (file && file.size > 0) {
			const bytes = await file.arrayBuffer();
			const buffer = Buffer.from(bytes);
			const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

			const uploadResult = await cloudinary.uploader.upload(base64, {
				folder: "user_avatars",
				upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
			});

			// Xóa avatar cũ
			if (user.avatar?.public_id) {
				await cloudinary.api.delete_resources([user.avatar.public_id]);
			}

			user.avatar = {
				public_id: uploadResult.public_id,
				url: uploadResult.secure_url,
			};
		}

		await user.save();

		return NextResponse.json({
			data: {
				_id: user._id.toString(),
				avatar: user.avatar,
				name: user.name,
				role: user.role,
			},
			message: "Cập nhật hồ sơ thành công",
			status: 200,
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, status: 500, success: false },
			{ status: 500 },
		);
	}
}
