"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import CouponForm from "./coupon-form";

const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/deef71c3q/image/upload/";

// Tóm tắt đơn hàng bên checkout — verify giỏ, coupon, tổng tiền
const OrderSummary = ({
  appliedCoupon,
  couponDiscount,
  setAppliedCoupon,
  setCouponDiscount,
}) => {
  const cartState = useSelector((store) => store.cart);
  const cart = cartState.cart;

  // Serialize để useEffect chỉ chạy khi nội dung giỏ thay đổi
  const cartItems = JSON.stringify(cart);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, item) =>
        acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0,
    );
  }, [cart]);

  // Gọi API kiểm tra tồn kho mỗi khi giỏ thay đổi (trước thanh toán)
  useEffect(() => {
    const products = JSON.parse(cartItems);
    const verifyCart = async () => {
      try {
        const payload = { products };
        const response = await axios.post("/api/cart/verification", payload);
        if (response.data.success) {
        }
      } catch (_error) {}
    };
    verifyCart();
  }, [cartItems]);

  const totalAmount = subtotal - couponDiscount;

  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN", {
      currency: "VND",
      style: "currency",
    });
  };

  return (
    <div className="bg-white border rounded-3xl p-6 sticky top-24">
      <h2 className="text-2xl font-bold mb-6">Tóm tắt đơn hàng</h2>

      {cart.length > 0 && (
        <div className="space-y-4 mb-6 pb-6 border-b">
          {cart.map((item) => (
            <div className="flex gap-3" key={item.variantId}>
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  alt={item.name || "Sản phẩm"}
                  className="object-cover"
                  fill
                  src={
                    item.image?.startsWith("http")
                      ? item.image
                      : `${CLOUDINARY_BASE_URL}${item.image || ""}`
                  }
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
                {item.color && (
                  <p className="text-xs text-neutral-500">
                    {item.color}
                    {item.size ? ` / ${item.size}` : ""}
                  </p>
                )}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-neutral-500">
                    x{item.quantity}
                  </span>
                  <span className="text-sm font-semibold">
                    {formatPrice(Number(item.price) * Number(item.quantity))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CouponForm
        appliedCoupon={appliedCoupon}
        setAppliedCoupon={setAppliedCoupon}
        setCouponDiscount={setCouponDiscount}
        subtotal={subtotal}
      />
      <div className="space-y-4 mt-8">
        <div className="flex items-center justify-between">
          <span className="text-neutral-600">Tổng phụ</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-neutral-600">Giảm giá mã</span>
            <span className="text-red-600 font-semibold">
              -{formatPrice(couponDiscount)}
            </span>
          </div>
        )}
        <div className="border-t pt-4 flex items-center justify-between">
          <span className="text-lg font-bold">Tổng cộng</span>
          <span className="text-2xl font-bold">{formatPrice(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
