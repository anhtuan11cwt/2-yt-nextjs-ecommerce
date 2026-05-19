"use client";

import { FiBox, FiGrid, FiShoppingCart, FiUsers } from "react-icons/fi";
import useSWR from "swr";
import DashboardCard from "./dashboard-card";

// Hàm fetch dữ liệu cho SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

// Hiển thị 4 thống kê chính (danh mục, sản phẩm, khách hàng, đơn hàng)
export default function CountOverview() {
  const { data, isLoading } = useSWR("/api/admin/dashboard/count", fetcher, {
    refreshInterval: 5000,
  });

  const stats = data?.data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <DashboardCard
        gradient="from-indigo-500 to-indigo-700"
        icon={<FiGrid />}
        title="Danh mục"
        value={isLoading ? "..." : stats?.totalCategories}
      />
      <DashboardCard
        gradient="from-orange-500 to-red-500"
        icon={<FiBox />}
        title="Sản phẩm"
        value={isLoading ? "..." : stats?.totalProducts}
      />
      <DashboardCard
        gradient="from-emerald-500 to-teal-600"
        icon={<FiUsers />}
        title="Khách hàng"
        value={isLoading ? "..." : stats?.totalCustomers}
      />
      <DashboardCard
        gradient="from-pink-500 to-rose-600"
        icon={<FiShoppingCart />}
        title="Đơn hàng"
        value={isLoading ? "..." : stats?.totalOrders}
      />
    </div>
  );
}
