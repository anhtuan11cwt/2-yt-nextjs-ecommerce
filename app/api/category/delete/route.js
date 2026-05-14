import { NextResponse } from "next/server";

import connectDB from "@/lib/dbConnection";
import Category from "@/models/category.model";

export async function DELETE(request) {
	try {
		await connectDB();

		const body = await request.json();
		const { id, deleteType } = body;

		if (deleteType === "PD") {
			await Category.findByIdAndDelete(id);
		} else {
			await Category.findByIdAndUpdate(id, { deletedAt: new Date() });
		}

		return NextResponse.json({
			message: "Xóa danh mục thành công",
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, success: false },
			{ status: 500 },
		);
	}
}
