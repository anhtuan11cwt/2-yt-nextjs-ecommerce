"use client";

import AdminBreadcrumb from "@/components/application/admin/breadcrumb";
import DataTable from "@/components/application/admin/DataTable";
import ADMIN_ROUTES from "@/routes/admin.routes";

// Trang quản lý đánh giá sản phẩm
export default function ReviewPage() {
	const breadcrumbData = [
		{ href: ADMIN_ROUTES.DASHBOARD, label: "Bảng điều khiển" },
		{ label: "Đánh giá" },
	];

	const columns = [
		{
			accessorKey: "product.name",
			header: "Sản phẩm",
		},
		{
			accessorKey: "user.name",
			cell: ({ row }) => (
				<div>
					<div className="font-medium">{row.original.user?.name}</div>
					<div className="text-xs text-muted-foreground">
						{row.original.user?.email}
					</div>
				</div>
			),
			header: "Người dùng",
		},
		{
			accessorKey: "rating",
			cell: ({ row }) => (
				<span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-medium">
					⭐ {row.original.rating} Sao
				</span>
			),
			header: "Đánh giá",
		},
		{ accessorKey: "title", header: "Tiêu đề" },
		{
			accessorKey: "content",
			cell: ({ row }) => (
				<div className="max-w-[300px] truncate">{row.original.content}</div>
			),
			header: "Nội dung",
		},
	];

	return (
		<div className="p-5">
			<AdminBreadcrumb breadcrumbData={breadcrumbData} />
			<div className="mb-5">
				<h1 className="text-2xl font-semibold">Đánh giá</h1>
			</div>
			<DataTable columns={columns} fetchUrl="/api/review" />
		</div>
	);
}
