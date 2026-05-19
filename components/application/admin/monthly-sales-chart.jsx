"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const MONTHS = [
  "Th1",
  "Th2",
  "Th3",
  "Th4",
  "Th5",
  "Th6",
  "Th7",
  "Th8",
  "Th9",
  "Th10",
  "Th11",
  "Th12",
];

const formatCurrency = (amount) =>
  (amount || 0).toLocaleString("vi-VN", {
    currency: "VND",
    style: "currency",
  });

// Biểu đồ doanh thu theo tháng
export default function MonthlySalesChart() {
  const { data, isLoading } = useSWR(
    "/api/admin/dashboard/monthly-sales",
    fetcher,
  );

  const chartData = useMemo(() => {
    if (!data?.success || !data?.data) return [];
    return MONTHS.map((month, index) => {
      const matched = data.data.find((item) => item._id.month === index + 1);
      return {
        amount: matched ? Math.round(matched.totalSales) : 0,
        month,
      };
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-gray-500">
        Đang tải dữ liệu doanh thu...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">
        Doanh thu theo tháng
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={chartData}>
            <CartesianGrid
              stroke="#f0f0f0"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="month"
              fontSize={12}
              stroke="#94a3b8"
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              fontSize={12}
              stroke="#94a3b8"
              tickFormatter={(val) =>
                val >= 1000000
                  ? `${(val / 1000000).toFixed(0)}M`
                  : val >= 1000
                    ? `${(val / 1000).toFixed(0)}K`
                    : val
              }
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(value), "Doanh thu"]}
            />
            <Bar
              barSize={32}
              dataKey="amount"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
