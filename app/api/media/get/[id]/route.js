import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import MediaModel from "@/models/Media.model";

// API lấy media theo ID
export async function GET(_request, { params }) {
	try {
		await isAuthenticated("admin");
		await connectDB();

		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ message: "ID Media Không Hợp Lệ", success: false },
				{ status: 400 },
			);
		}

		const media = await MediaModel.findOne({ _id: id, deletedAt: null });

		if (!media) {
			return NextResponse.json(
				{ message: "Không Tìm Thấy Media", success: false },
				{ status: 404 },
			);
		}

		return NextResponse.json({ media, success: true }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: error?.message || "Lỗi Máy Chủ Nội Bộ", success: false },
			{ status: error?.statusCode || 500 },
		);
	}
}
