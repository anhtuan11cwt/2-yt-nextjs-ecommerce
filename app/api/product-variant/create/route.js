import { NextResponse } from "next/server";

import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import Product from "@/models/product.model";
import ProductVariant from "@/models/productVariant.model";
import { productVariantFormSchema } from "@/validators/productVariant.validator";

// API tạo biến thể sản phẩm
export async function POST(request) {
	try {
		await isAuthenticated("admin");
		await connectDB();

		const body = await request.json();
		const parsed = productVariantFormSchema.parse({
			color: body?.color,
			discountPercent: body?.discountPercent ?? 0,
			media: Array.isArray(body?.media) ? body.media : [],
			mrp: body?.mrp,
			product: body?.product,
			sellingPrice: body?.sellingPrice,
			size: body?.size,
			sku: body?.sku,
		});

		const color = parsed.color.trim();
		const size = parsed.size.trim();
		const sku = parsed.sku.trim().toUpperCase();

		const parent = await Product.findById(parsed.product);
		if (!parent) {
			return NextResponse.json(
				{ message: "Không tìm thấy sản phẩm", success: false },
				{ status: 404 },
			);
		}

		const skuTaken = await ProductVariant.findOne({
			deletedAt: null,
			sku,
		});
		if (skuTaken) {
			return NextResponse.json(
				{ message: "SKU đã tồn tại", success: false },
				{ status: 409 },
			);
		}

		const dupCombo = await ProductVariant.findOne({
			color,
			deletedAt: null,
			product: parsed.product,
			size,
		});
		if (dupCombo) {
			return NextResponse.json(
				{
					message: "Biến thể cùng màu và kích cỡ đã tồn tại cho sản phẩm này",
					success: false,
				},
				{ status: 409 },
			);
		}

		const variant = await ProductVariant.create({
			color,
			media: parsed.media,
			mrp: parsed.mrp,
			product: parsed.product,
			sellingPrice: parsed.sellingPrice,
			size,
			sku,
		});

		return NextResponse.json({
			data: variant,
			message: "Tạo biến thể thành công",
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, success: false },
			{ status: error?.statusCode || 500 },
		);
	}
}
