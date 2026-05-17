"use client";

import AdminBreadcrumb from "@/components/application/admin/breadcrumb";
import ADMIN_ROUTES from "@/routes/admin.routes";

// Trang chi tiết đơn hàng
export default function OrderDetailsPage() {
	const breadcrumbData = [
		{ href: ADMIN_ROUTES.DASHBOARD, label: "Bảng điều khiển" },
		{ href: ADMIN_ROUTES.ORDERS, label: "Đơn hàng" },
		{ href: "#", label: "Chi tiết đơn hàng" },
	];

	return (
		<div className="p-5">
			<AdminBreadcrumb breadcrumbData={breadcrumbData} />
			<h1 className="mt-2 font-bold text-2xl">Chi tiết đơn hàng</h1>
			<p className="mt-4 text-gray-500">Trang này sẽ được hoàn thiện sau.</p>
		</div>
	);
}
