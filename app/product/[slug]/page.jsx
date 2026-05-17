import axios from "axios";
import ProductDetails from "@/components/website/product-details";

const getProductDetails = async (slug, searchParams) => {
	try {
		const color = searchParams?.color || "";
		const size = searchParams?.size || "";

		const query = new URLSearchParams();

		if (color) query.append("color", color);
		if (size) query.append("size", size);

		const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

		const response = await axios.get(
			`${baseUrl}/api/product/details/${slug}?${query}`,
		);

		return response.data;
	} catch (_error) {
		return null;
	}
};

const Page = async ({ params, searchParams }) => {
	const resolvedParams = await params;
	const resolvedSearchParams = await searchParams;
	const data = await getProductDetails(
		resolvedParams.slug,
		resolvedSearchParams,
	);

	if (!data?.success) {
		return (
			<div className="py-20 text-center">
				<h2 className="text-2xl font-semibold">Không Tìm Thấy Sản Phẩm</h2>
			</div>
		);
	}

	return <ProductDetails data={data} />;
};

export default Page;
