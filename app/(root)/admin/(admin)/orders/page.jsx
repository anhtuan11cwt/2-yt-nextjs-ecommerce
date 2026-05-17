"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AdminBreadcrumb from "@/components/application/admin/breadcrumb";
import DataTable from "@/components/application/admin/DataTable";
import DataTableWrapper from "@/components/application/admin/DataTableWrapper";
import ADMIN_ROUTES from "@/routes/admin.routes";
import { getColumns } from "./columns";

// Trang danh sách đơn hàng admin
export default function OrdersPage() {
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: async (id) => {
			const response = await fetch(`/api/admin/orders/delete?id=${id}`, {
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

	const columns = getColumns(deleteMutation.mutate);

	const breadcrumbData = [
		{ href: ADMIN_ROUTES.DASHBOARD, label: "Bảng điều khiển" },
		{ href: ADMIN_ROUTES.ORDERS, label: "Đơn hàng" },
	];

	return (
		<div className="p-5">
			<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
				<div>
					<AdminBreadcrumb breadcrumbData={breadcrumbData} />
					<h1 className="mt-2 text-2xl font-bold">Tất cả đơn hàng</h1>
				</div>
			</div>
			<DataTableWrapper>
				<DataTable
					columns={columns}
					deleteType="SD"
					enableRowSelection={false}
					fetchUrl="/api/admin/orders"
				/>
			</DataTableWrapper>
		</div>
	);
}
