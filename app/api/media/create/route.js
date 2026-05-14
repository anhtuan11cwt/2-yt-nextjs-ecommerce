import { NextResponse } from "next/server";
import ServerError from "@/errors/server-error";
import { isAuthenticated } from "@/helpers/is-authenticated";
import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/dbConnection";
import MediaModel from "@/models/Media.model";

export async function POST(request) {
	try {
		await isAuthenticated("admin");
		await connectDB();

		const body = await request.json();
		const mediaList = body?.media || [];

		if (!mediaList.length) {
			return NextResponse.json(
				{ message: "Danh Sách Media Bắt Buộc", success: false },
				{ status: 400 },
			);
		}

		const publicIds = mediaList.map((item) => item.publicId);

		try {
			const mediaData = await MediaModel.insertMany(mediaList);
			return NextResponse.json(
				{ mediaData, message: "Tải Lên Media Thành Công", success: true },
				{ status: 201 },
			);
		} catch (_databaseError) {
			await cloudinary.api.delete_resources(publicIds);
			throw new ServerError("Lưu Cơ Sở Dữ Liệu Thất Bại");
		}
	} catch (error) {
		return NextResponse.json(
			{ message: error?.message || "Lỗi Máy Chủ Nội Bộ", success: false },
			{ status: error?.statusCode || 500 },
		);
	}
}
