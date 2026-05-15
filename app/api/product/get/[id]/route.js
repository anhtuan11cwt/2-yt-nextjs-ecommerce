import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import Product from "@/models/product.model";

// API lấy sản phẩm theo ID (có populate)
export async function GET(_request, { params }) {
	try {
		await isAuthenticated("admin");
		await connectDB();

		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ message: "ID sản phẩm không hợp lệ", success: false },
				{ status: 400 },
			);
		}

		const oid = new mongoose.Types.ObjectId(id);

		const rows = await Product.aggregate([
			{ $match: { _id: oid } },
			{
				$lookup: {
					as: "category",
					foreignField: "_id",
					from: "categories",
					localField: "category",
				},
			},
			{ $unwind: "$category" },
			{
				$lookup: {
					as: "media",
					foreignField: "_id",
					from: "media",
					localField: "media",
				},
			},
		]);

		const product = rows[0] || null;

		if (!product) {
			return NextResponse.json(
				{ message: "Không tìm thấy sản phẩm", success: false },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			data: product,
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, success: false },
			{ status: error?.statusCode || 500 },
		);
	}
}
