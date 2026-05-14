import { NextResponse } from "next/server";

import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import Product from "@/models/product.model";

export async function DELETE(request) {
	try {
		await isAuthenticated("admin");
		await connectDB();

		const body = await request.json();
		const { id, deleteType } = body;

		if (!id) {
			return NextResponse.json(
				{ message: "Thiếu ID sản phẩm", success: false },
				{ status: 400 },
			);
		}

		if (deleteType === "PD") {
			await Product.findByIdAndDelete(id);
		} else {
			await Product.findByIdAndUpdate(id, { deletedAt: new Date() });
		}

		return NextResponse.json({
			message: "Xóa sản phẩm thành công",
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, success: false },
			{ status: error?.statusCode || 500 },
		);
	}
}
