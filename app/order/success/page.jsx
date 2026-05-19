"use client";

import axios from "axios";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/features/cartSlice";

// Trang xác nhận thanh toán Stripe thành công — xác nhận đơn và xóa giỏ
const OrderSuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const confirmCalled = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      redirect("/cart");
      return;
    }

    if (confirmCalled.current) return;
    confirmCalled.current = true;

    const confirmOrder = async () => {
      try {
        const res = await axios.post("/api/order/confirm", { sessionId });
        if (res.data.success) {
          setOrder(res.data.order);
          dispatch(clearCart());
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi xác nhận đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    confirmOrder();
  }, [sessionId, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-lg">Đang xác nhận đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2">Thanh toán thất bại</h1>
          <p className="text-neutral-600 mb-6">{error}</p>
          <Link
            className="inline-block bg-black text-white px-8 py-3 rounded-xl font-medium"
            href="/cart"
          >
            Quay lại giỏ hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
        <p className="text-neutral-600 mb-2">
          Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
        </p>
        {order && (
          <p className="text-sm text-neutral-500 mb-6">
            Mã đơn hàng: #{order._id}
          </p>
        )}
        <div className="flex flex-col gap-3">
          <Link
            className="bg-black text-white px-8 py-3 rounded-xl font-medium"
            href="/shop"
          >
            Tiếp tục mua sắm
          </Link>
          <Link
            className="border border-black text-black px-8 py-3 rounded-xl font-medium"
            href="/"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
