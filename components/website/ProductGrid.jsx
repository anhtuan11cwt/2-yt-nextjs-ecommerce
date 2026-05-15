"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductBox from "./ProductBox";

// Component hiển thị lưới sản phẩm với phân trang
export default function ProductGrid() {
	const searchParams = useSearchParams();
	const [products, setProducts] = useState([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			try {
				const params = new URLSearchParams(searchParams.toString());
				const { data } = await axios.get(
					`/api/product/get-shop-products?${params.toString()}`,
				);

				setProducts(data.data);
				setTotal(data.total);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, [searchParams]);

	if (loading) {
		return (
			<div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						className="h-80 animate-pulse rounded-2xl bg-gray-100"
						key={i.toString()}
					/>
				))}
			</div>
		);
	}

	if (products.length === 0) {
		return (
			<div className="flex h-60 items-center justify-center">
				<p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
			</div>
		);
	}

	return (
		<div>
			<p className="mb-4 text-sm text-gray-500">
				Hiển thị {products.length} / {total} sản phẩm
			</p>

			<div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
				{products.map((product) => (
					<ProductBox key={product._id} product={product} />
				))}
			</div>
		</div>
	);
}
