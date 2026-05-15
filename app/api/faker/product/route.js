import { faker } from "@faker-js/faker";
import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnection";
import CategoryModel from "@/models/category.model";
import MediaModel from "@/models/Media.model";
import ProductModel from "@/models/product.model";
import ProductVariantModel from "@/models/productVariant.model";

const COLORS = ["Black", "White", "Blue", "Red"];
const SIZES = ["S", "M", "L", "XL", "XXL"];

export async function POST() {
	try {
		await connectDB();

		const categories = await CategoryModel.find({ deletedAt: null });
		if (!categories.length) {
			return NextResponse.json(
				{ message: "Không tìm thấy danh mục", success: false },
				{ status: 400 },
			);
		}

		const media = await MediaModel.find({ deletedAt: null });
		if (!media.length) {
			return NextResponse.json(
				{ message: "Không tìm thấy file media", success: false },
				{ status: 400 },
			);
		}

		const mediaIds = media.map((item) => item._id);
		const products = [];

		for (const category of categories) {
			for (let i = 0; i < 5; i++) {
				const mrp = faker.number.int({ max: 5000, min: 500 });
				const discountPercent = faker.number.int({ max: 60, min: 5 });
				const sellingPrice = Math.floor(mrp - (mrp * discountPercent) / 100);

				products.push({
					category: category._id,
					deletedAt: null,
					description: faker.commerce.productDescription(),
					discountPercent,
					media: faker.helpers.arrayElements(mediaIds, 4),
					mrp,
					name: faker.commerce.productName(),
					sellingPrice,
					slug:
						faker.helpers.slugify(faker.commerce.productName().toLowerCase()) +
						"-" +
						faker.string.alphanumeric(6),
				});
			}
		}

		const insertedProducts = await ProductModel.insertMany(products);

		const variants = [];
		for (const product of insertedProducts) {
			for (const color of COLORS) {
				for (const size of SIZES) {
					variants.push({
						color,
						deletedAt: null,
						discountPercent: product.discountPercent,
						media: product.media,
						mrp: product.mrp,
						product: product._id,
						sellingPrice: product.sellingPrice,
						size,
						sku: faker.string.alphanumeric(10),
					});
				}
			}
		}

		await ProductVariantModel.insertMany(variants);

		return NextResponse.json({
			message: "Đã tạo sản phẩm giả thành công",
			stats: {
				categories: categories.length,
				products: insertedProducts.length,
				variants: variants.length,
			},
			success: true,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Lỗi máy chủ nội bộ", success: false },
			{ status: 500 },
		);
	}
}
