import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnection";
import ProductModel from "@/models/product.model";
import ProductVariantModel from "@/models/productVariant.model";
import "@/models/media.model";

export async function POST(req) {
	try {
		await connectDB();
		const body = await req.json();
		const { products } = body;

		if (!products || !Array.isArray(products)) {
			return NextResponse.json(
				{ message: "Dữ liệu giỏ hàng không hợp lệ", success: false },
				{ status: 400 },
			);
		}

		const variantIds = products.map((item) => item.variantId);

		const variants = await ProductVariantModel.find({
			_id: { $in: variantIds },
		})
			.populate({ model: ProductModel, path: "product" })
			.populate("media");

		const variantMap = {};
		variants.forEach((variant) => {
			variantMap[variant._id.toString()] = variant;
		});

		const verifiedProducts = [];

		for (const item of products) {
			const variant = variantMap[item.variantId];

			if (!variant || variant.quantity <= 0) continue;

			const safeQuantity = Math.min(item.quantity, variant.quantity);

			verifiedProducts.push({
				color: variant.color,
				image: variant.media?.[0]?.secureUrl || "",
				name: variant.product.name,
				price: variant.product.sellingPrice,
				productId: variant.product._id,
				quantity: safeQuantity,
				size: variant.size,
				slug: variant.product.slug,
				stock: variant.quantity,
				subtotal: variant.product.sellingPrice * safeQuantity,
				variantId: variant._id,
			});
		}

		const total = verifiedProducts.reduce(
			(acc, item) => acc + item.subtotal,
			0,
		);

		return NextResponse.json({
			products: verifiedProducts,
			success: true,
			total,
		});
	} catch (error) {
		console.error("Lỗi xác thực giỏ hàng:", error);
		return NextResponse.json(
			{ message: "Lỗi máy chủ", success: false },
			{ status: 500 },
		);
	}
}
