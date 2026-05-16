import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import MediaModel from "@/models/media.model";

// API danh sách media với phân trang
export async function GET(request) {
	try {
		await isAuthenticated("admin");
		await connectDB();

		const { searchParams } = new URL(request.url);
		const page = Number(searchParams.get("page")) || 1;
		const limit = Number(searchParams.get("limit")) || 10;
		const deleteType = searchParams.get("deleteType") || "active";

		const skip = (page - 1) * limit;

		const filter = {};
		if (deleteType === "deleted") {
			filter.deletedAt = { $ne: null };
		} else {
			filter.deletedAt = null;
		}

		const totalCount = await MediaModel.countDocuments(filter);
		const mediaData = await MediaModel.find(filter)
			.sort({ _id: -1, createdAt: -1 })
			.skip(skip)
			.limit(limit);

		const hasMore = totalCount > skip + mediaData.length;

		return NextResponse.json(
			{
				hasMore,
				mediaData,
				success: true,
				totalCount,
			},
			{ status: 200 },
		);
	} catch (error) {
		return NextResponse.json(
			{ message: error?.message || "Lỗi Máy Chủ Nội Bộ", success: false },
			{ status: error?.statusCode || 500 },
		);
	}
}
