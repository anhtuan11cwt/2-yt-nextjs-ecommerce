import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import MediaModel from "@/models/media.model";

// Schema validation cập nhật media
const updateMediaSchema = z.object({
	alt: z.string().optional().default(""),
	id: z.string().min(1, "ID Media Bắt Buộc"),
	title: z.string().optional().default(""),
});

// API cập nhật alt text và tiêu đề media
export async function PUT(request) {
	try {
		await isAuthenticated("admin");
		await connectDB();

		const body = await request.json();
		const validatedData = updateMediaSchema.parse(body);
		const { id, alt, title } = validatedData;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ message: "ID Media Không Hợp Lệ", success: false },
				{ status: 400 },
			);
		}

		const media = await MediaModel.findById(id);

		if (!media) {
			return NextResponse.json(
				{ message: "Không Tìm Thấy Media", success: false },
				{ status: 404 },
			);
		}

		if (alt !== undefined) media.alt = alt;
		if (title !== undefined) media.title = title;

		await media.save();

		return NextResponse.json(
			{ media, message: "Cập Nhật Media Thành Công", success: true },
			{ status: 200 },
		);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					message: error.errors?.[0]?.message || "Dữ Liệu Không Hợp Lệ",
					success: false,
				},
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ message: error?.message || "Lỗi Máy Chủ Nội Bộ", success: false },
			{ status: error?.statusCode || 500 },
		);
	}
}
