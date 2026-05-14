import { NextResponse } from "next/server";
import slugify from "slugify";

import connectDB from "@/lib/dbConnection";
import Category from "@/models/category.model";
import { categorySchema } from "@/validators/category.validator";

export async function POST(request) {
	try {
		await connectDB();

		const body = await request.json();
		const name = body?.name?.trim();

		const slug = slugify(name, {
			lower: true,
			strict: true,
			trim: true,
		});

		const validated = categorySchema.parse({ name, slug });

		const alreadyExists = await Category.findOne({ slug: validated.slug });

		if (alreadyExists) {
			return NextResponse.json(
				{ message: "Danh mục đã tồn tại", success: false },
				{ status: 400 },
			);
		}

		const category = await Category.create(validated);

		return NextResponse.json({
			data: category,
			message: "Tạo danh mục thành công",
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, success: false },
			{ status: 500 },
		);
	}
}
