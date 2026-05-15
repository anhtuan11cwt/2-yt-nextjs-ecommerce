"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { VariantForm } from "@/components/application/admin/variant-form";

// Trang chỉnh sửa biến thể sản phẩm
export default function AdminVariantEditPage() {
	const { id } = useParams();

	const { data: variantRes, isLoading } = useQuery({
		queryFn: async () => {
			const r = await fetch(`/api/product-variant/get/${id}`);
			const j = await r.json();
			if (!r.ok) {
				throw new Error(j.message);
			}
			return j;
		},
		queryKey: ["product-variant", id],
	});

	const variant = variantRes?.data;

	if (isLoading) {
		return <div className="p-5">Đang tải...</div>;
	}
	if (!variant) {
		return <div className="p-5">Không tìm thấy biến thể</div>;
	}

	return <VariantForm initialVariant={variant} key={String(variant._id)} />;
}
