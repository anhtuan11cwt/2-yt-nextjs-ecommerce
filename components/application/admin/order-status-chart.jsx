"use client";

import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const STATUS_LABELS = {
	Cancelled: "Đã hủy",
	Delivered: "Đã giao",
	Pending: "Chờ xử lý",
	Processing: "Đang xử lý",
	Shipped: "Đã gửi hàng",
};

const STATUS_COLORS = {
	Cancelled: "#ef4444",
	Delivered: "#22c55e",
	Pending: "#3b82f6",
	Processing: "#eab308",
	Shipped: "#f97316",
};

// Biểu đồ phân bố trạng thái đơn hàng
export default function OrderStatusChart() {
	const { data, isLoading } = useSWR(
		"/api/admin/dashboard/order-status",
		fetcher,
	);

	if (isLoading) {
		return (
			<div className="flex h-[300px] items-center justify-center text-sm text-gray-500">
				Đang tải phân bố trạng thái...
			</div>
		);
	}

	const rawData = data?.data || [];
	const chartData = rawData.map((item) => ({
		color: STATUS_COLORS[item._id] || "#94a3b8",
		name: STATUS_LABELS[item._id] || item._id,
		value: item.count,
	}));

	const totalOrders = chartData.reduce((sum, item) => sum + item.value, 0);

	return (
		<div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
			<h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">
				Phân bố trạng thái đơn hàng
			</h3>
			<div className="h-[300px] w-full">
				{chartData.length === 0 ? (
					<div className="flex h-full items-center justify-center text-sm text-gray-400">
						Chưa có dữ liệu đơn hàng
					</div>
				) : (
					<ResponsiveContainer height="100%" width="100%">
						<PieChart>
							<Pie
								cx="50%"
								cy="50%"
								data={chartData}
								dataKey="value"
								innerRadius={60}
								outerRadius={90}
								paddingAngle={4}
							>
								{chartData.map((entry) => (
									<Cell fill={entry.color} key={entry.name} />
								))}
							</Pie>
							<Tooltip formatter={(value, name) => [`${value} đơn`, name]} />
							<Legend
								align="center"
								iconType="circle"
								layout="horizontal"
								verticalAlign="bottom"
							/>
						</PieChart>
					</ResponsiveContainer>
				)}
			</div>
			{totalOrders > 0 && (
				<p className="mt-2 text-center text-sm text-gray-500">
					Tổng cộng: <span className="font-semibold">{totalOrders}</span> đơn
					hàng
				</p>
			)}
		</div>
	);
}
