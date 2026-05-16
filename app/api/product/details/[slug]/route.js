import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnection";
import Product from "@/models/product.model";
import ProductVariant from "@/models/productVariant.model";
import "@/models/media.model"; // Ensure Media is registered
import "@/models/category.model"; // Ensure Category is registered

export async function GET(req, { params }) {
	try {
		await dbConnect();

		const { slug } = await params;
		const { searchParams } = new URL(req.url);

		const color = searchParams.get("color");
		const size = searchParams.get("size");

		const product = await Product.findOne({ slug })
			.populate("media")
			.populate("category");

		if (!product) {
			return NextResponse.json(
				{
					message: "Không tìm thấy sản phẩm",
					success: false,
				},
				{ status: 404 },
			);
		}

		const variants = await ProductVariant.find({
			product: product._id,
		}).populate("media");

		const uniqueColors = [...new Set(variants.map((v) => v.color))];
		const uniqueSizes = [...new Set(variants.map((v) => v.size))];

		let selectedVariant = null;

		if (color && size) {
			selectedVariant = variants.find(
				(v) => v.color === color && v.size === size,
			);
		}

		if (!selectedVariant && color) {
			selectedVariant = variants.find((v) => v.color === color);
		}

		if (!selectedVariant) {
			selectedVariant = variants[0];
		}

		const reviewCount = Math.floor(Math.random() * 200) + 20;

		return NextResponse.json({
			colors: uniqueColors,
			product,
			reviewCount,
			sizes: uniqueSizes,
			success: true,
			variant: selectedVariant,
		});
	} catch (_error) {
		return NextResponse.json(
			{
				message: "Đã xảy ra lỗi",
				success: false,
			},
			{ status: 500 },
		);
	}
}
