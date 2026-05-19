"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import AdminBreadcrumb from "@/components/application/admin/breadcrumb";
import CouponForm from "@/components/application/admin/coupon-form";
import ADMIN_ROUTES from "@/routes/admin.routes";

// Trang chỉnh sửa mã giảm giá
export default function EditCouponPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { data: couponRes, isLoading } = useQuery({
    queryFn: async () => {
      const r = await fetch(`/api/coupon/get/${id}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.message);
      return j;
    },
    queryKey: ["coupon", id],
  });

  const coupon = couponRes?.coupon;

  // Xử lý cập nhật mã giảm giá
  const handleSubmit = async (e, formData) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("/api/coupon/update", {
        body: JSON.stringify({ ...formData, id }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success("Cập nhật mã giảm giá thành công");
      router.push(ADMIN_ROUTES.ADMIN_COUPON_SHOW);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbData = [
    { href: ADMIN_ROUTES.DASHBOARD, label: "Bảng điều khiển" },
    { href: ADMIN_ROUTES.ADMIN_COUPON_SHOW, label: "Mã giảm giá" },
    {
      href: ADMIN_ROUTES.ADMIN_COUPON_EDIT(id),
      label: "Chỉnh sửa mã giảm giá",
    },
  ];

  if (isLoading) {
    return <div className="p-5">Đang tải...</div>;
  }

  if (!coupon) {
    return <div className="p-5">Không tìm thấy mã giảm giá</div>;
  }

  return (
    <div className="p-5">
      <AdminBreadcrumb breadcrumbData={breadcrumbData} />
      <h1 className="text-2xl font-bold mb-5">Chỉnh sửa mã giảm giá</h1>
      <div className="max-w-3xl">
        <CouponForm
          initialData={coupon}
          key={String(coupon._id)}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
