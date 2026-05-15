import { NextResponse } from "next/server";
import slugify from "slugify";

import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import { prepareDescriptionForStorage } from "@/lib/product-description";
import Product from "@/models/product.model";
import { productFormSchema } from "@/validators/product.validator";

// Tính phần trăm giảm giá
function computeDiscountPercent(mrp, sellingPrice) {
	if (!(mrp > 0)) {
		return 0;
	}
	return Math.round(((mrp - sellingPrice) / mrp) * 100);
}

// API tạo sản phẩm mới
export async function POST(request) {
	try {
		await isAuthenticated("admin");
		await connectDB();

		const body = await request.json();
		const parsed = productFormSchema.parse({
			category: body?.category,
			description: body?.description ?? "",
			discountPercent: body?.discountPercent ?? 0,
			media: Array.isArray(body?.media) ? body.media : [],
			mrp: body?.mrp,
			name: body?.name,
			sellingPrice: body?.sellingPrice,
		});

		const name = parsed.name.trim();
		const slug = slugify(name, {
			lower: true,
			strict: true,
			trim: true,
		});

		const duplicate = await Product.findOne({ slug });
		if (duplicate) {
			return NextResponse.json(
				{ message: "Slug sản phẩm đã tồn tại", success: false },
				{ status: 400 },
			);
		}

		const discountPercent = computeDiscountPercent(
			parsed.mrp,
			parsed.sellingPrice,
		);
		const descriptionStored = prepareDescriptionForStorage(parsed.description);

		const product = await Product.create({
			category: parsed.category,
			description: descriptionStored,
			discountPercent,
			media: parsed.media,
			mrp: parsed.mrp,
			name,
			sellingPrice: parsed.sellingPrice,
			slug,
		});

		return NextResponse.json({
			data: product,
			message: "Tạo sản phẩm thành công",
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, success: false },
			{ status: error?.statusCode || 500 },
		);
	}
}
