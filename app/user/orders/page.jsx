"use client";

import Link from "next/link";
import WebsiteBreadcrumb from "@/components/website/WebsiteBreadcrumb";
import useFetch from "@/hooks/useFetch";

// Trang danh sách đơn hàng của User
export default function UserOrdersPage() {
  const breadcrumbLinks = [{ label: "Đơn hàng" }];

  const { data: ordersData, loading } = useFetch({
    url: "/api/user-orders",
  });

  const orders = ordersData?.data ?? [];

  return (
    <>
      <WebsiteBreadcrumb links={breadcrumbLinks} />

      <div className="shadow rounded p-5">
        <h2 className="text-xl font-semibold border-b pb-3 mb-5">Đơn hàng</h2>

        {loading ? (
          <div className="text-center py-10 text-gray-500 animate-pulse">
            Đang tải danh sách đơn hàng...
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
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
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr key={order._id}>
                      <td className="p-3 border-b text-gray-600">
                        {index + 1}
                      </td>
                      <td className="p-3 border-b">
                        <Link
                          className="underline underline-offset-2 hover:text-blue-500"
                          href={`/order-details/${order._id}`}
                        >
                          {order._id}
                        </Link>
                      </td>
                      <td className="p-3 border-b text-gray-600">
                        {order.products?.length ?? 0}
                      </td>
                      <td className="p-3 border-b font-semibold">
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
                      Bạn chưa có đơn hàng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
