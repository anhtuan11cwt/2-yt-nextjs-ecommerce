"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { ProductForm } from "@/components/application/admin/product-form";

export default function AdminProductEditPage() {
	const { id } = useParams();

	const { data: productRes, isLoading } = useQuery({
		queryFn: async () => {
			const r = await fetch(`/api/product/get/${id}`);
			const j = await r.json();
			if (!r.ok) {
				throw new Error(j.message);
			}
			return j;
		},
		queryKey: ["product", id],
	});

	const product = productRes?.data;

	if (isLoading) {
		return <div className="p-5">Đang tải...</div>;
	}
	if (!product) {
		return <div className="p-5">Không tìm thấy sản phẩm</div>;
	}

	return <ProductForm initialProduct={product} key={String(product._id)} />;
}
