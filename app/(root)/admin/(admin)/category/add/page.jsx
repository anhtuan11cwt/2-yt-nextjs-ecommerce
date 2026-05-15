"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import slugify from "slugify";

import AdminBreadcrumb from "@/components/application/admin/breadcrumb";
import ADMIN_ROUTES from "@/routes/admin.routes";

// Trang thêm danh mục
export default function AddCategoryPage() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [formData, setFormData] = useState({ name: "", slug: "" });

	// Tự động sinh slug từ tên danh mục
	const handleNameChange = (e) => {
		const value = e.target.value;
		setFormData({
			name: value,
			slug: slugify(value, { lower: true, strict: true, trim: true }),
		});
	};

	const createMutation = useMutation({
		mutationFn: async (data) => {
			const response = await fetch("/api/category/create", {
				body: JSON.stringify(data),
				headers: { "Content-Type": "application/json" },
				method: "POST",
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.message);
			return result;
		},
		onError: (error) => toast.error(error?.message),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["datatable"] });
			toast.success("Tạo danh mục thành công");
			router.push(ADMIN_ROUTES.CATEGORIES);
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		createMutation.mutate(formData);
	};

	const breadcrumbData = [
		{ href: ADMIN_ROUTES.DASHBOARD, label: "Bảng điều khiển" },
		{ href: ADMIN_ROUTES.CATEGORIES, label: "Danh mục" },
		{ href: ADMIN_ROUTES.ADD_CATEGORY, label: "Thêm danh mục" },
	];

	return (
		<div className="p-5">
			<AdminBreadcrumb breadcrumbData={breadcrumbData} />
			<h1 className="text-2xl font-bold mb-5">Thêm danh mục</h1>
			<div className="max-w-xl">
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
						disabled={createMutation.isPending}
						type="submit"
					>
						{createMutation.isPending ? "Đang tạo..." : "Tạo danh mục"}
					</button>
				</form>
			</div>
		</div>
	);
}
