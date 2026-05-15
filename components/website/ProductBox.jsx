import Image from "next/image";
import Link from "next/link";

const PLACEHOLDER = "https://placehold.co/600x800/png";
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

function formatPrice(price) {
	return Number(price).toLocaleString("vi-VN", {
		currency: "VND",
		style: "currency",
	});
}

export default function ProductBox({ product }) {
	const imagePath = product?.media?.[0]?.path;
	const image = imagePath
		? `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${imagePath}`
		: PLACEHOLDER;

	return (
		<Link
			className="group overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:shadow-xl"
			href={`/website/product/${product.slug}`}
		>
			<div className="relative aspect-[4/5] overflow-hidden">
				<Image
					alt={product.name}
					className="object-cover transition-transform duration-500 group-hover:scale-105"
					fill
					src={image}
				/>
			</div>

			<div className="p-4">
				<h3 className="line-clamp-1 text-sm font-semibold lg:text-base">
					{product.name}
				</h3>

				<div className="mt-2 flex items-center gap-2">
					<span className="text-xs text-gray-400 line-through lg:text-sm">
						{formatPrice(product.mrp)}
					</span>
					<span className="text-sm font-bold text-primary lg:text-base">
						{formatPrice(product.sellingPrice)}
					</span>
				</div>
			</div>
		</Link>
	);
}
