"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminBreadcrumb from "@/components/application/admin/breadcrumb";
import { Button } from "@/components/ui/button";
import ADMIN_ROUTES from "@/routes/admin.routes";

const statusStyles = {
  Cancelled: "bg-red-50 text-red-700 border-red-200",
  Delivered: "bg-green-50 text-green-700 border-green-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Processing: "bg-blue-50 text-blue-700 border-blue-200",
  Shipped: "bg-purple-50 text-purple-700 border-purple-200",
};

const statusLabels = {
  Cancelled: "Đã hủy",
  Delivered: "Đã giao",
  Pending: "Chờ xử lý",
  Processing: "Đang xử lý",
  Shipped: "Đã gửi hàng",
};

const paymentStyles = {
  Failed: "bg-red-50 text-red-700 border-red-200",
  Paid: "bg-green-50 text-green-700 border-green-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
};

const paymentLabels = {
  Failed: "Thất bại",
  Paid: "Đã thanh toán",
  Pending: "Chờ thanh toán",
};

const STATUS_OPTIONS = [
  { label: "Chờ xử lý", value: "Pending" },
  { label: "Đang xử lý", value: "Processing" },
  { label: "Đã gửi hàng", value: "Shipped" },
  { label: "Đã giao", value: "Delivered" },
  { label: "Đã hủy", value: "Cancelled" },
];

const formatCurrency = (amount) =>
  (amount || 0).toLocaleString("vi-VN", {
    currency: "VND",
    style: "currency",
  });

// Trang chi tiết đơn hàng admin
export default function AdminOrderDetailsPage() {
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/order/get/${orderId}`);
      if (data?.success) {
        setOrder(data.order);
        setOrderStatus(data.order.orderStatus || "Pending");
      }
    } catch {
      toast.error("Không thể tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrder();
  }, [fetchOrder]);

  const handleUpdateStatus = async () => {
    if (!orderStatus) {
      toast.error("Vui lòng chọn trạng thái");
      return;
    }

    try {
      setUpdatingStatus(true);
      const { data } = await axios.put("/api/order/update-status", {
        _id: order._id,
        status: orderStatus,
      });

      if (data?.success) {
        toast.success("Cập nhật trạng thái thành công");
        fetchOrder();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi cập nhật trạng thái");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const breadcrumbData = [
    { href: ADMIN_ROUTES.DASHBOARD, label: "Bảng điều khiển" },
    { href: ADMIN_ROUTES.ORDERS, label: "Đơn hàng" },
    { href: "#", label: "Chi tiết đơn hàng" },
  ];

  if (loading) {
    return (
      <div className="p-5">
        <AdminBreadcrumb breadcrumbData={breadcrumbData} />
        <div className="py-20 text-center text-lg font-medium text-gray-500">
          Đang tải thông tin đơn hàng...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-5">
        <AdminBreadcrumb breadcrumbData={breadcrumbData} />
        <div className="py-20 text-center">
          <p className="text-lg font-medium text-red-500">
            Không tìm thấy đơn hàng
          </p>
          <Link
            className="mt-4 inline-block text-indigo-600 hover:underline"
            href={ADMIN_ROUTES.ORDERS}
          >
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  const subTotal = order.products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="p-5">
      <AdminBreadcrumb breadcrumbData={breadcrumbData} />

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Khối trái: thông tin đơn hàng */}
        <div className="space-y-6 lg:col-span-2">
          {/* Thông tin đơn hàng */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="space-y-4 border-b border-gray-100 pb-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Mã đơn hàng
                  </p>
                  <p className="mt-1 select-all text-base font-semibold text-gray-900 dark:text-white">
                    {order._id}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Mã giao dịch
                  </p>
                  <p className="mt-1 text-base font-semibold text-gray-700 dark:text-slate-300">
                    {order.stripePaymentIntentId || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Trạng thái đơn hàng
                  </p>
                  <span
                    className={`mt-2 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[order.orderStatus] || statusStyles.Pending}`}
                  >
                    {statusLabels[order.orderStatus] || order.orderStatus}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Thanh toán
                  </p>
                  <span
                    className={`mt-2 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${paymentStyles[order.paymentStatus] || paymentStyles.Pending}`}
                  >
                    {paymentLabels[order.paymentStatus] || order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="pt-5">
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                Sản phẩm đã mua
              </h3>
              <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-slate-800">
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="hidden border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-700 md:table-header-group dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-4" scope="col">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-4 text-center" scope="col">
                        Giá đơn vị
                      </th>
                      <th className="px-6 py-4 text-center" scope="col">
                        Số lượng
                      </th>
                      <th className="px-6 py-4 text-right" scope="col">
                        Tổng cộng
                      </th>
                    </tr>
                  </thead>

                  <tbody className="block divide-y divide-gray-100 md:table-row-group dark:divide-slate-800">
                    {order.products.map((item) => {
                      const variantMedia = item.variant?.media?.[0];
                      const thumbImg =
                        item.image ||
                        variantMedia?.path ||
                        variantMedia?.thumbnailUrl ||
                        "/placeholder.jpg";

                      return (
                        <tr
                          className="block border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50/50 md:table-row md:border-b-0 dark:border-slate-800 dark:hover:bg-slate-900/50"
                          key={item._id || item.variant?._id}
                        >
                          <td className="block px-6 py-4 md:table-cell">
                            <div className="flex items-center space-x-4">
                              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 dark:border-slate-800">
                                <Image
                                  alt={item.name || "Product"}
                                  className="object-cover"
                                  fill
                                  src={thumbImg}
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                  {item.product?.name || item.name}
                                </p>
                                {(item.color || item.size) && (
                                  <p className="mt-0.5 text-xs capitalize text-gray-500 dark:text-slate-400">
                                    {item.color && `Màu: ${item.color}`}
                                    {item.color && item.size && " / "}
                                    {item.size && `Size: ${item.size}`}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="flex items-center justify-between px-6 py-3 text-right font-medium text-gray-700 before:content-['Giá_đơn_vị:'] md:table-cell md:py-4 md:text-center md:before:content-none dark:text-slate-300">
                            <span>{formatCurrency(item.price)}</span>
                          </td>

                          <td className="flex items-center justify-between px-6 py-3 text-right font-medium text-gray-900 before:content-['Số_lượng:'] md:table-cell md:py-4 md:text-center md:before:content-none dark:text-white">
                            <span>{item.quantity}</span>
                          </td>

                          <td className="flex items-center justify-between px-6 py-3 text-right font-bold text-indigo-600 before:content-['Tổng:'] md:table-cell md:py-4 md:before:content-none">
                            <span>
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Địa chỉ giao hàng */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5 dark:border-slate-800 dark:bg-slate-950">
            <h4 className="mb-4 border-b border-gray-200/60 pb-2 text-base font-bold text-gray-900 dark:border-slate-800 dark:text-white">
              Địa chỉ giao hàng
            </h4>

            <div className="grid grid-cols-1 gap-x-4 gap-y-3 text-sm text-gray-600 sm:grid-cols-2 dark:text-slate-400">
              <div>
                <span className="font-medium text-gray-500 dark:text-slate-500">
                  Họ và tên:
                </span>{" "}
                {order.shippingAddress?.name || "—"}
              </div>
              <div>
                <span className="font-medium text-gray-500 dark:text-slate-500">
                  Email:
                </span>{" "}
                {order.shippingAddress?.email || "—"}
              </div>
              <div>
                <span className="font-medium text-gray-500 dark:text-slate-500">
                  Điện thoại:
                </span>{" "}
                {order.shippingAddress?.phone || "—"}
              </div>
              <div>
                <span className="font-medium text-gray-500 dark:text-slate-500">
                  Tỉnh/Bang:
                </span>{" "}
                {order.shippingAddress?.state || "—"}
              </div>
              <div>
                <span className="font-medium text-gray-500 dark:text-slate-500">
                  Thành phố:
                </span>{" "}
                {order.shippingAddress?.city || "—"}
              </div>
              <div>
                <span className="font-medium text-gray-500 dark:text-slate-500">
                  Mã bưu điện:
                </span>{" "}
                {order.shippingAddress?.pincode || "—"}
              </div>
              <div>
                <span className="font-medium text-gray-500 dark:text-slate-500">
                  Địa danh:
                </span>{" "}
                {order.shippingAddress?.landmark || "Trống"}
              </div>
            </div>

            {order.orderNote && (
              <div className="mt-3 rounded-lg border border-gray-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                <span className="mb-1 block font-medium text-gray-500 dark:text-slate-500">
                  Ghi chú đơn hàng:
                </span>
                <span className="italic text-gray-700 dark:text-slate-300">
                  {order.orderNote}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Khối phải: cập nhật trạng thái + tóm tắt */}
        <div className="space-y-6">
          {/* Cập nhật trạng thái */}
          <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-5 shadow-sm dark:border-violet-900/50 dark:bg-slate-950">
            <h3 className="mb-4 border-b border-violet-200 pb-3 text-lg font-semibold text-violet-900 dark:border-violet-900 dark:text-violet-400">
              Quản trị trạng thái
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                  htmlFor="order-status"
                >
                  Trạng thái đơn hàng
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  id="order-status"
                  onChange={(e) => setOrderStatus(e.target.value)}
                  value={orderStatus}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                className="w-full cursor-pointer"
                disabled={updatingStatus}
                onClick={handleUpdateStatus}
              >
                {updatingStatus ? "Đang cập nhật..." : "Lưu trạng thái"}
              </Button>
            </div>
          </div>

          {/* Tóm tắt hóa đơn */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5 dark:border-slate-800 dark:bg-slate-950">
            <h4 className="mb-4 border-b border-gray-200/60 pb-2 text-base font-bold text-gray-900 dark:border-slate-800 dark:text-white">
              Tóm tắt hóa đơn
            </h4>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-gray-600 dark:text-slate-400">
                <span>Tạm tính</span>
                <span className="font-medium">{formatCurrency(subTotal)}</span>
              </div>

              {order.couponDiscount > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <span>
                    Giảm giá
                    {order.couponCode && ` (${order.couponCode})`}
                  </span>
                  <span className="font-medium">
                    -{formatCurrency(order.couponDiscount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between border-b border-gray-200/60 pb-3 text-green-600 dark:border-slate-800">
                <span>Chiết khấu sản phẩm</span>
                <span className="font-medium">
                  -{formatCurrency(subTotal - order.totalAmount)}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-base font-bold text-gray-900 dark:text-white">
                Tổng tiền thanh toán
              </span>
              <span className="text-2xl font-black text-indigo-600">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
