import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import Product from "@/models/product.model";
import ProductVariant from "@/models/productVariant.model";
import { productVariantFormSchema } from "@/validators/productVariant.validator";

// Tính phần trăm giảm giá
function computeDiscountPercent(mrp, sellingPrice) {
	if (!(mrp > 0)) {
		return 0;
	}
	return Math.round(((mrp - sellingPrice) / mrp) * 100);
}

// API cập nhật biến thể
export async function PUT(request, { params }) {
	try {
		await isAuthenticated("admin");
		await connectDB();

		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ message: "ID biến thể không hợp lệ", success: false },
				{ status: 400 },
			);
		}

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
			_id: { $ne: id },
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
			_id: { $ne: id },
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

		const discountPercent = computeDiscountPercent(
			parsed.mrp,
			parsed.sellingPrice,
		);

		const updated = await ProductVariant.findByIdAndUpdate(
			id,
			{
				color,
				discountPercent,
				media: parsed.media,
				mrp: parsed.mrp,
				product: parsed.product,
				sellingPrice: parsed.sellingPrice,
				size,
				sku,
			},
			{ new: true },
		);

		if (!updated) {
			return NextResponse.json(
				{ message: "Không tìm thấy biến thể", success: false },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			data: updated,
			message: "Cập nhật biến thể thành công",
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, success: false },
			{ status: error?.statusCode || 500 },
		);
	}
}
