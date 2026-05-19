"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/redux/features/cartSlice";

const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/deef71c3q/image/upload/";

// Trang giỏ hàng — danh sách sản phẩm, sửa số lượng, tổng tiền
export default function CartPage() {
  const dispatch = useDispatch();
  const cart = useSelector((store) => store.cart.cart);

  const subtotal = cart.reduce((total, item) => {
    return total + (Number(item.price) || 0) * (Number(item.quantity) || 1);
  }, 0);

  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN", {
      currency: "VND",
      style: "currency",
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="mx-auto text-gray-300" size={70} />
          <h2 className="text-2xl font-semibold mt-5">Giỏ hàng trống</h2>
          <p className="text-gray-500 mt-2">
            Bạn chưa thêm sản phẩm nào vào giỏ hàng.
          </p>
          <Link
            className="inline-flex items-center justify-center mt-6 h-12 px-8 rounded-xl bg-black text-white hover:bg-gray-800 transition-all duration-300"
            href="/shop"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-10 lg:py-14 px-4 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold">Giỏ hàng</h1>
          <p className="text-gray-500 mt-2">Kiểm tra đơn hàng của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border rounded-2xl overflow-hidden bg-white">
              <div className="hidden md:grid grid-cols-12 gap-4 border-b bg-gray-50 px-6 py-4">
                <div className="col-span-6 font-medium">Sản phẩm</div>
                <div className="col-span-2 font-medium text-center">Giá</div>
                <div className="col-span-2 font-medium text-center">
                  Số lượng
                </div>
                <div className="col-span-2 font-medium text-right">Tổng</div>
              </div>

              <div>
                {cart.map((item) => (
                  <div
                    className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-4 px-5 md:px-6 py-6 border-b last:border-b-0"
                    key={item.variantId}
                  >
                    <div className="md:col-span-6">
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            alt={item.name || "Sản phẩm"}
                            className="object-cover"
                            fill
                            src={
                              item.image.startsWith("http")
                                ? item.image
                                : `${CLOUDINARY_BASE_URL}${item.image}`
                            }
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <div className="mt-2 space-y-1 text-sm text-gray-500">
                            <p>Màu: {item.color}</p>
                            <p>Kích thước: {item.size}</p>
                          </div>
                          <button
                            className="flex items-center gap-2 mt-4 text-sm text-red-500 hover:text-red-600"
                            onClick={() =>
                              dispatch(removeFromCart(item.variantId))
                            }
                            type="button"
                          >
                            <Trash2 size={16} />
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex md:block items-center justify-between">
                      <span className="md:hidden font-medium">Giá</span>
                      <p className="text-center font-medium">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="md:col-span-2 flex md:block items-center justify-between">
                      <span className="md:hidden font-medium">Số lượng</span>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-gray-100 transition-all"
                          onClick={() =>
                            dispatch(decreaseQuantity(item.variantId))
                          }
                          type="button"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-gray-100 transition-all"
                          onClick={() =>
                            dispatch(increaseQuantity(item.variantId))
                          }
                          type="button"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex md:block items-center justify-between">
                      <span className="md:hidden font-medium">Tổng</span>
                      <p className="text-right font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="border rounded-2xl p-6 sticky top-24 bg-white">
              <h2 className="text-2xl font-semibold">Tóm tắt đơn hàng</h2>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Tổng phụ</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Tổng cộng</span>
                    <span className="text-2xl font-bold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                </div>
                <Link
                  className="w-full h-14 rounded-xl bg-black text-white flex items-center justify-center font-medium hover:bg-gray-800 transition-all duration-300"
                  href="/checkout"
                >
                  Tiến hành thanh toán
                </Link>
                <Link
                  className="w-full h-14 rounded-xl border flex items-center justify-center font-medium hover:bg-gray-50 transition-all duration-300"
                  href="/shop"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
