"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Tooltip } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import toast from "react-hot-toast";
import AdminBreadcrumb from "@/components/application/admin/breadcrumb";
import DataTable from "@/components/application/admin/DataTable";
import DataTableWrapper from "@/components/application/admin/DataTableWrapper";
import ADMIN_ROUTES from "@/routes/admin.routes";

export default function CouponShowPage() {
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: async (id) => {
			const response = await fetch(`/api/coupon/delete?id=${id}`, {
				method: "DELETE",
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.message);
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
			accessorKey: "code",
			header: "Mã giảm giá",
		},
		{
			accessorFn: (row) => `${row.discountPercent}%`,
			header: "Giảm giá",
			id: "discountPercent",
		},
		{
			accessorKey: "minimumShoppingAmount",
			header: "Số tiền tối thiểu",
		},
		{
			accessorKey: "validity",
			Cell: ({ cell }) => {
				const date = new Date(cell.getValue());
				return date.toLocaleDateString("vi-VN");
			},
			header: "Ngày hết hạn",
		},
		{
			accessorKey: "validity",
			Cell: ({ cell }) => {
				const isExpired = new Date(cell.getValue()) < new Date();
				return (
					<span
						className={`px-3 py-1 rounded-full text-xs font-medium ${
							isExpired
								? "bg-red-100 text-red-600"
								: "bg-green-100 text-green-600"
						}`}
					>
						{isExpired ? "Expired" : "Active"}
					</span>
				);
			},
			enableColumnFilter: false,
			enableSorting: false,
			header: "Trạng thái",
			id: "status",
		},
		{
			Cell: ({ row }) => (
				<div className="flex items-center gap-1">
					<Tooltip title="Chỉnh sửa">
						<IconButton
							component={Link}
							href={ADMIN_ROUTES.ADMIN_COUPON_EDIT(row.original._id)}
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
		{ href: ADMIN_ROUTES.ADMIN_COUPON_SHOW, label: "Mã giảm giá" },
	];

	return (
		<div className="p-5">
			<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
				<div>
					<AdminBreadcrumb breadcrumbData={breadcrumbData} />
					<h1 className="mt-2 text-2xl font-bold">Tất cả mã giảm giá</h1>
				</div>
				<Link
					className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-black/80"
					href={ADMIN_ROUTES.ADMIN_COUPON_ADD}
				>
					Thêm mã giảm giá
				</Link>
			</div>
			<DataTableWrapper>
				<DataTable
					columns={columns}
					deleteType="SD"
					enableRowSelection={false}
					fetchUrl="/api/coupon"
				/>
			</DataTableWrapper>
		</div>
	);
}
