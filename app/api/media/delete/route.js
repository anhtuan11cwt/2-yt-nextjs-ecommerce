import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { isAuthenticated } from "@/helpers/is-authenticated";
import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/dbConnection";
import MediaModel from "@/models/Media.model";

export async function PUT(request) {
	try {
		await isAuthenticated("admin");
		await connectDB();

		const body = await request.json();
		const { ids, deleteType } = body;

		if (!ids?.length) {
			return NextResponse.json(
				{ message: "Ids Bắt Buộc", success: false },
				{ status: 400 },
			);
		}

		if (!deleteType) {
			return NextResponse.json(
				{ message: "Delete Type Bắt Buộc", success: false },
				{ status: 400 },
			);
		}

		if (deleteType === "SD") {
			await MediaModel.updateMany(
				{ _id: { $in: ids } },
				{ deletedAt: new Date().toISOString() },
			);

			return NextResponse.json(
				{ message: "Media Đã Được Di Chuyển Vào Thùng Rác", success: true },
				{ status: 200 },
			);
		}

		if (deleteType === "RSD") {
			await MediaModel.updateMany({ _id: { $in: ids } }, { deletedAt: null });

			return NextResponse.json(
				{ message: "Media Đã Được Khôi Phục", success: true },
				{ status: 200 },
			);
		}

		return NextResponse.json(
			{ message: "Delete Type Không Hợp Lệ", success: false },
			{ status: 400 },
		);
	} catch (error) {
		return NextResponse.json(
			{ message: error?.message || "Lỗi Máy Chủ Nội Bộ", success: false },
			{ status: error?.statusCode || 500 },
		);
	}
}

export async function DELETE(request) {
	const session = await mongoose.startSession();

	try {
		await isAuthenticated("admin");
		await connectDB();

		const body = await request.json();
		const { ids } = body;

		if (!ids?.length) {
			return NextResponse.json(
				{ message: "Ids Bắt Buộc", success: false },
				{ status: 400 },
			);
		}

		session.startTransaction();

		const medias = await MediaModel.find({ _id: { $in: ids } }).session(
			session,
		);

		const publicIds = medias.map((media) => media.publicId);

		await MediaModel.deleteMany({ _id: { $in: ids } }).session(session);

		await cloudinary.api.delete_resources(publicIds);

		await session.commitTransaction();

		return NextResponse.json(
			{ message: "Media Đã Được Xóa Vĩnh Viễn", success: true },
			{ status: 200 },
		);
	} catch (error) {
		await session.abortTransaction();

		return NextResponse.json(
			{ message: error?.message || "Lỗi Máy Chủ Nội Bộ", success: false },
			{ status: error?.statusCode || 500 },
		);
	} finally {
		session.endSession();
	}
}
