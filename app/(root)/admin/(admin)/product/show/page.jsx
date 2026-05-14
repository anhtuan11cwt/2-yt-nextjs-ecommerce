"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Tooltip } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import AdminBreadcrumb from "@/components/application/admin/breadcrumb";
import DataTable from "@/components/application/admin/DataTable";
import DataTableWrapper from "@/components/application/admin/DataTableWrapper";
import ADMIN_ROUTES from "@/routes/admin.routes";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

function mediaThumbUrl(doc) {
	if (!doc) {
		return null;
	}
	if (doc.thumbnailUrl) {
		return doc.thumbnailUrl;
	}
	if (doc.path && CLOUD) {
		return `https://res.cloudinary.com/${CLOUD}/image/upload/${doc.path}`;
	}
	return null;
}

export default function ProductShowPage() {
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: async (id) => {
			const response = await fetch("/api/product/delete", {
				body: JSON.stringify({ id }),
				headers: { "Content-Type": "application/json" },
				method: "DELETE",
			});
			const result = await response.json();
			if (!response.ok) {
				throw new Error(result.message);
			}
			return result;
		},
		onError: (error) => toast.error(error?.message),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["datatable"] });
			toast.success(data?.message);
		},
	});

	const columns = [
		{
			Cell: ({ row }) => {
				const first = row.original.media?.[0];
				const src = mediaThumbUrl(first);
				if (!src) {
					return <span className="text-muted-foreground text-xs">—</span>;
				}
				return (
					<div className="relative h-12 w-12 overflow-hidden rounded-md border">
						<Image
							alt=""
							className="object-cover"
							fill
							sizes="48px"
							src={src}
						/>
					</div>
				);
			},
			enableColumnFilter: false,
			enableSorting: false,
			header: "Ảnh",
			id: "thumbnail",
			size: 72,
		},
		{
			accessorKey: "name",
			header: "Tên",
		},
		{
			accessorFn: (row) => row.category?.name || "—",
			header: "Danh mục",
			id: "categoryName",
		},
		{
			accessorKey: "mrp",
			header: "MRP",
		},
		{
			accessorKey: "sellingPrice",
			header: "Giá bán",
		},
		{
			accessorKey: "discountPercent",
			header: "Giảm %",
		},
		{
			accessorFn: (row) => (row.deletedAt ? "Đã xóa" : "Hoạt động"),
			header: "Trạng thái",
			id: "status",
		},
		{
			Cell: ({ row }) => (
				<div className="flex items-center gap-1">
					<Tooltip title="Chỉnh sửa">
						<IconButton
							component={Link}
							href={`${ADMIN_ROUTES.PRODUCT_EDIT}/${row.original._id}`}
						>
							<EditIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Xóa">
						<IconButton
							color="error"
							onClick={() => deleteMutation.mutate(row.original._id)}
						>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</div>
			),
			enableColumnFilter: false,
			enableSorting: false,
			header: "Hành động",
			id: "actions",
		},
	];

	const breadcrumbData = [
		{ href: ADMIN_ROUTES.DASHBOARD, label: "Bảng điều khiển" },
		{ href: ADMIN_ROUTES.PRODUCT_SHOW, label: "Sản phẩm" },
	];

	return (
		<div className="p-5">
			<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
				<div>
					<AdminBreadcrumb breadcrumbData={breadcrumbData} />
					<h1 className="mt-2 text-2xl font-bold">Tất cả sản phẩm</h1>
				</div>
				<Link
					className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-black/80"
					href={ADMIN_ROUTES.PRODUCT_ADD}
				>
					Thêm sản phẩm
				</Link>
			</div>
			<DataTableWrapper>
				<DataTable
					columns={columns}
					deleteType="SD"
					enableRowSelection={false}
					fetchUrl="/api/product/show"
				/>
			</DataTableWrapper>
		</div>
	);
}
