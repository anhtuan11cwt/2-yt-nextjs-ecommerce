"use client";

import Link from "next/link";
import useSWR from "swr";
import ADMIN_ROUTES from "@/routes/admin.routes";

const fetcher = (url) => fetch(url).then((res) => res.json());

const STATUS_STYLES = {
	Cancelled: "bg-red-50 text-red-700",
	Delivered: "bg-green-50 text-green-700",
	Pending: "bg-amber-50 text-amber-700",
	Processing: "bg-blue-50 text-blue-700",
	Shipped: "bg-purple-50 text-purple-700",
};

const STATUS_LABELS = {
	Cancelled: "Đã hủy",
	Delivered: "Đã giao",
	Pending: "Chờ xử lý",
	Processing: "Đang xử lý",
	Shipped: "Đã gửi hàng",
};

const formatCurrency = (amount) =>
	(amount || 0).toLocaleString("vi-VN", {
		currency: "VND",
		style: "currency",
	});

// Bảng 10 đơn hàng mới nhất
export default function LatestOrdersTable() {
	const { data, isLoading } = useSWR(
		"/api/admin/dashboard/latest-orders",
		fetcher,
	);
	const orders = data?.data || [];

	if (isLoading) {
		return (
			<div className="flex h-[400px] items-center justify-center rounded-xl border border-gray-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
				<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600" />
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
			<div className="flex items-center justify-between border-b border-gray-50 p-5 dark:border-slate-800">
				<h3 className="font-semibold text-slate-800 dark:text-white">
					Đơn hàng mới nhất
				</h3>
				<Link
					className="text-xs font-medium text-indigo-600 hover:underline"
					href={ADMIN_ROUTES.ORDERS}
				>
					Xem tất cả
				</Link>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full text-left text-sm">
					<thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400 dark:bg-slate-800/50">
						<tr>
							<th className="p-4">Mã đơn</th>
							<th className="p-4">Sản phẩm</th>
							<th className="p-4">Tổng tiền</th>
							<th className="p-4">Trạng thái</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
						{orders.length === 0 ? (
							<tr>
								<td className="p-4 text-center text-gray-400" colSpan={4}>
									Chưa có đơn hàng nào
								</td>
							</tr>
						) : (
							orders.map((order) => (
								<tr
									className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
									key={order._id}
								>
									<td className="p-4">
										<Link
											className="font-mono text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
											href={ADMIN_ROUTES.ORDER_DETAILS(order._id)}
										>
											#{order._id.substring(18).toUpperCase()}
										</Link>
									</td>
									<td className="p-4 text-slate-500 dark:text-slate-400">
										{order.products?.length || 0} sản phẩm
									</td>
									<td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
										{formatCurrency(order.totalAmount)}
									</td>
									<td className="p-4">
										<span
											className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[order.orderStatus] || STATUS_STYLES.Pending}`}
										>
											{STATUS_LABELS[order.orderStatus] || order.orderStatus}
										</span>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
