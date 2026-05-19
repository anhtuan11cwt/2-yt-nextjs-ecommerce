"use client";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { IconButton, Tooltip } from "@mui/material";
import { format } from "date-fns";
import Link from "next/link";
import ADMIN_ROUTES from "@/routes/admin.routes";

// Component xem chi tiết đơn hàng
const ViewAction = ({ orderId }) => (
  <Tooltip title="Xem chi tiết">
    <IconButton component={Link} href={ADMIN_ROUTES.ORDER_DETAILS(orderId)}>
      <RemoveRedEyeIcon />
    </IconButton>
  </Tooltip>
);

// Map màu và nhãn tiếng Việt cho trạng thái đơn hàng
const STATUS_MAP = {
  Cancelled: { color: "bg-red-100 text-red-600", label: "Đã hủy" },
  Delivered: { color: "bg-green-100 text-green-600", label: "Đã giao" },
  Pending: { color: "bg-yellow-100 text-yellow-600", label: "Chờ xử lý" },
  Processing: { color: "bg-blue-100 text-blue-600", label: "Đang xử lý" },
  Shipped: { color: "bg-cyan-100 text-cyan-600", label: "Đang giao" },
};

// Cấu hình cột bảng đơn hàng
export const getColumns = (_onDelete) => [
  {
    accessorFn: (row) => row._id?.slice(-8).toUpperCase(),
    header: "Mã đơn hàng",
    id: "orderId",
  },
  {
    accessorFn: (row) => row.shippingAddress?.name || "N/A",
    header: "Tên khách hàng",
    id: "customerName",
  },
  {
    accessorFn: (row) => row.shippingAddress?.email || "N/A",
    header: "Email",
    id: "email",
  },
  {
    accessorFn: (row) => row.shippingAddress?.phone || "N/A",
    header: "Số điện thoại",
    id: "phone",
  },
  {
    accessorFn: (row) => row.shippingAddress?.state || "N/A",
    header: "Tỉnh/Thành phố",
    id: "state",
  },
  {
    accessorFn: (row) => row.shippingAddress?.city || "N/A",
    header: "Quận/Huyện",
    id: "city",
  },
  {
    accessorFn: (row) => row.shippingAddress?.pincode || "N/A",
    header: "Mã bưu điện",
    id: "pincode",
  },
  {
    accessorFn: (row) => row.products?.length ?? 0,
    header: "Tổng sản phẩm",
    id: "totalItems",
  },
  {
    accessorFn: (row) =>
      (row.totalAmount || 0).toLocaleString("vi-VN", {
        currency: "VND",
        style: "currency",
      }),
    header: "Tổng tiền",
    id: "totalAmount",
  },
  {
    accessorFn: (row) => {
      const status = row.orderStatus || "Pending";
      const { label, color } = STATUS_MAP[status] || STATUS_MAP.Pending;
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
          {label}
        </span>
      );
    },
    header: "Trạng thái",
    id: "status",
  },
  {
    accessorFn: (row) => {
      const date = row.createdAt ? new Date(row.createdAt) : null;
      return date ? format(date, "dd/MM/yyyy HH:mm") : "N/A";
    },
    header: "Ngày tạo",
    id: "createdAt",
  },
  {
    Cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <ViewAction orderId={row.original._id} />
      </div>
    ),
    enableColumnFilter: false,
    enableSorting: false,
    header: "Hành động",
    id: "actions",
  },
];
