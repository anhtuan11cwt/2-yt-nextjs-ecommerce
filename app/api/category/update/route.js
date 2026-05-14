import { NextResponse } from "next/server";
import slugify from "slugify";

import connectDB from "@/lib/dbConnection";
import Category from "@/models/category.model";
import { categorySchema } from "@/validators/category.validator";

export async function PUT(request) {
	try {
		await connectDB();

		const body = await request.json();
		const { id, name } = body;

		const slug = slugify(name, {
			lower: true,
			strict: true,
			trim: true,
		});

		const validated = categorySchema.parse({ name, slug });

		const alreadyExists = await Category.findOne({
			_id: { $ne: id },
			slug: validated.slug,
		});

		if (alreadyExists) {
			return NextResponse.json(
				{ message: "Slug đã tồn tại", success: false },
				{ status: 400 },
			);
		}

		const updatedCategory = await Category.findByIdAndUpdate(id, validated, {
			new: true,
		});

		return NextResponse.json({
			data: updatedCategory,
			message: "Cập nhật danh mục thành công",
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, success: false },
			{ status: 500 },
		);
	}
}
