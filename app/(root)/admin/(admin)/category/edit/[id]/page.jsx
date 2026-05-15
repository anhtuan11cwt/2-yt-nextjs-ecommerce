"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import slugify from "slugify";

import AdminBreadcrumb from "@/components/application/admin/breadcrumb";
import ADMIN_ROUTES from "@/routes/admin.routes";

// Form chỉnh sửa danh mục
function CategoryEditForm({ category, id }) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const [formData, setFormData] = useState({
		name: category.name || "",
		slug: category.slug || "",
	});

	// Tự động sinh slug từ tên danh mục
	const handleNameChange = (e) => {
		const value = e.target.value;
		setFormData({
			name: value,
			slug: slugify(value, { lower: true, strict: true, trim: true }),
		});
	};

	const updateMutation = useMutation({
		mutationFn: async (data) => {
			const response = await fetch("/api/category/update", {
				body: JSON.stringify({ id, ...data }),
				headers: { "Content-Type": "application/json" },
				method: "PUT",
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.message);
			return result;
		},
		onError: (error) => toast.error(error?.message),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["datatable"] });
			toast.success("Cập nhật danh mục thành công");
			router.push(ADMIN_ROUTES.CATEGORIES);
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		updateMutation.mutate(formData);
	};

	return (
		<form className="space-y-5" onSubmit={handleSubmit}>
			<div>
				<label className="block text-sm font-medium mb-1" htmlFor="name">
					Tên danh mục
				</label>
				<input
					className="border w-full h-10 px-3 rounded-md"
					id="name"
					onChange={handleNameChange}
					placeholder="Nhập tên danh mục"
					type="text"
					value={formData.name}
				/>
			</div>
			<div>
				<label className="block text-sm font-medium mb-1" htmlFor="slug">
					Slug
				</label>
				<input
					className="border w-full h-10 px-3 rounded-md bg-muted/40"
					id="slug"
					readOnly
					type="text"
					value={formData.slug}
				/>
			</div>
			<button
				className="bg-black text-white px-5 py-2 rounded-md hover:bg-black/80"
				disabled={updateMutation.isPending}
				type="submit"
			>
				{updateMutation.isPending ? "Đang cập nhật..." : "Cập nhật danh mục"}
			</button>
		</form>
	);
}

// Trang chỉnh sửa danh mục
export default function EditCategoryPage() {
	const { id } = useParams();

	const { data: categoryData, isLoading } = useQuery({
		queryFn: async () => {
			const response = await fetch(`/api/category?id=${id}`);
			const result = await response.json();
			if (!response.ok) throw new Error(result.message);
			return result;
		},
		queryKey: ["category", id],
	});

	const category = categoryData?.data
		? Array.isArray(categoryData.data)
			? categoryData.data[0]
			: categoryData.data
		: null;

	const breadcrumbData = [
		{ href: ADMIN_ROUTES.DASHBOARD, label: "Bảng điều khiển" },
		{ href: ADMIN_ROUTES.CATEGORIES, label: "Danh mục" },
		{ href: "#", label: "Chỉnh sửa danh mục" },
	];

	if (isLoading) {
		return <div className="p-5">Đang tải...</div>;
	}

	if (!category) {
		return <div className="p-5">Không tìm thấy danh mục</div>;
	}

	return (
		<div className="p-5">
			<AdminBreadcrumb breadcrumbData={breadcrumbData} />
			<h1 className="text-2xl font-bold mb-5">Chỉnh sửa danh mục</h1>
			<div className="max-w-xl">
				<CategoryEditForm category={category} id={id} />
			</div>
		</div>
	);
}
