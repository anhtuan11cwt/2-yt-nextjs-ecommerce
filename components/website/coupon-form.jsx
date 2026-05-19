"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

// Form nhập và áp dụng mã giảm giá
const CouponForm = ({
  subtotal,
  setCouponDiscount,
  appliedCoupon,
  setAppliedCoupon,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode) return;
    try {
      setLoading(true);
      const response = await axios.post("/api/coupon/apply", {
        code: couponCode,
        subtotal,
      });
      if (response.data.success) {
        setCouponDiscount(response.data.couponDiscountAmount);
        setAppliedCoupon(response.data.coupon);
        toast.success("Mã giảm giá đã được áp dụng");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Mã không hợp lệ");
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
  };

  return (
    <div className="space-y-4">
      {!appliedCoupon ? (
        <div className="flex gap-3">
          <input
            className="flex-1 h-12 border rounded-xl px-4 outline-none"
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Nhập mã giảm giá"
            type="text"
            value={couponCode}
          />
          <button
            className="px-6 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition-all"
            disabled={loading}
            onClick={applyCoupon}
            type="button"
          >
            {loading ? "Đang xử lý..." : "Áp dụng"}
          </button>
        </div>
      ) : (
        <div className="border rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">{appliedCoupon.code}</p>
            <p className="text-sm text-neutral-500">
              {appliedCoupon.discountPercent}% OFF
            </p>
          </div>
          <button
            className="text-red-500 text-sm"
            onClick={removeCoupon}
            type="button"
          >
            Gỡ
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponForm;
