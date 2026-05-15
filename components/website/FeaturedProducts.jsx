import Link from "next/link";
import connectDB from "@/lib/dbConnection";
import Product from "@/models/product.model";
import ProductBox from "./ProductBox";

async function getFeaturedProducts() {
	try {
		await connectDB();

		const products = await Product.aggregate([
			{ $match: { deletedAt: null } },
			{ $sample: { size: 8 } },
			{
				$lookup: {
					as: "media",
					foreignField: "_id",
					from: "media",
					localField: "media",
				},
			},
		]);

		return products || [];
	} catch (error) {
		console.error("Error fetching featured products:", error);
		return [];
	}
}

export default async function FeaturedProducts() {
	const products = await getFeaturedProducts();

	return (
		<section className="w-full px-4 py-10 lg:px-32 lg:py-16">
			<div className="mb-8 flex items-center justify-between">
				<h2 className="text-2xl font-bold lg:text-4xl">Sản Phẩm Nổi Bật</h2>

				<Link
					className="text-sm font-medium hover:underline lg:text-base"
					href="/website/shop"
				>
					Xem Tất Cả
				</Link>
			</div>

			<div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
				{products.map((product) => (
					<ProductBox key={product._id} product={product} />
				))}
			</div>
		</section>
	);
}
