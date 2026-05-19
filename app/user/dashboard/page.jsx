"use client";

import Link from "next/link";
import { FiShoppingBag, FiShoppingCart } from "react-icons/fi";
import { useSelector } from "react-redux";
import WebsiteBreadcrumb from "@/components/website/WebsiteBreadcrumb";
import useFetch from "@/hooks/useFetch";

// Trang Tổng quan của User
export default function UserDashboardPage() {
  const breadcrumbLinks = [{ label: "Tổng quan" }];

  const { data: dashboardData, loading } = useFetch({
    url: "/api/dashboard/user",
  });

  const cartCount = useSelector((store) => store.cart.count);

  return (
    <>
      <WebsiteBreadcrumb links={breadcrumbLinks} />

      <div className="shadow rounded p-5">
        <h2 className="text-xl font-semibold border-b pb-3 mb-5">Tổng quan</h2>

        {loading ? (
          <div className="text-center py-10 text-gray-500 animate-pulse">
            Đang tải dữ liệu...
          </div>
        ) : (
          <>
            {/* Grid thống kê */}
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-10">
              {/* Tổng đơn hàng */}
              <div className="flex justify-between items-center border rounded p-5">
                <div>
                  <h4 className="font-semibold mb-1">Tổng đơn hàng</h4>
                  <span className="text-gray-500 font-semibold">
                    {dashboardData?.data?.totalOrder ?? 0}
                  </span>
                </div>
                <div className="w-16 h-16 rounded-full bg-primary flex justify-center items-center">
                  <FiShoppingBag className="text-white text-[25px]" />
                </div>
              </div>

              {/* Sản phẩm trong giỏ */}
              <div className="flex justify-between items-center border rounded p-5">
                <div>
                  <h4 className="font-semibold mb-1">Sản phẩm trong giỏ</h4>
                  <span className="text-gray-500 font-semibold">
                    {cartCount ?? 0}
                  </span>
                </div>
                <div className="w-16 h-16 rounded-full bg-primary flex justify-center items-center">
                  <FiShoppingCart className="text-white text-[25px]" />
                </div>
              </div>
            </div>

            {/* Bảng đơn hàng gần đây */}
            <div className="mt-5">
              <h4 className="text-lg font-semibold mb-3">Đơn hàng gần đây</h4>

              <div className="w-full overflow-x-auto border rounded">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="p-3 border-b text-gray-500 text-start whitespace-nowrap">
                        STT
                      </th>
                      <th className="p-3 border-b text-gray-500 text-start whitespace-nowrap">
                        Mã đơn hàng
                      </th>
                      <th className="p-3 border-b text-gray-500 text-start whitespace-nowrap">
                        Số lượng
                      </th>
                      <th className="p-3 border-b text-gray-500 text-start whitespace-nowrap">
                        Tổng tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.data?.recentOrders?.length > 0 ? (
                      dashboardData.data.recentOrders.map((order, index) => (
                        <tr key={order._id}>
                          <td className="p-3 text-gray-600">{index + 1}</td>
                          <td className="p-3">
                            <Link
                              className="underline underline-offset-2 hover:text-blue-500"
                              href={`/order-details/${order._id}`}
                            >
                              {order._id}
                            </Link>
                          </td>
                          <td className="p-3 text-gray-600">
                            {order.products?.length ?? 0}
                          </td>
                          <td className="p-3 font-semibold">
                            {new Intl.NumberFormat("vi-VN", {
                              currency: "VND",
                              style: "currency",
                            }).format(order.totalAmount ?? 0)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          className="p-3 text-center text-gray-400 italic"
                          colSpan={4}
                        >
                          Chưa có đơn hàng nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
