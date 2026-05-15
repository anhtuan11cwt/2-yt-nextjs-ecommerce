import { NextResponse } from "next/server";

import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import ProductVariant from "@/models/productVariant.model";

export async function DELETE(request) {
	try {
		await isAuthenticated("admin");
		await connectDB();

		const body = await request.json();
		const { id, deleteType } = body;

		if (!id) {
			return NextResponse.json(
				{ message: "Thiếu ID biến thể", success: false },
				{ status: 400 },
			);
		}

		if (deleteType === "PD") {
			await ProductVariant.findByIdAndDelete(id);
		} else {
			await ProductVariant.findByIdAndUpdate(id, { deletedAt: new Date() });
		}

		return NextResponse.json({
			message: "Xóa biến thể thành công",
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, success: false },
			{ status: error?.statusCode || 500 },
		);
	}
}
