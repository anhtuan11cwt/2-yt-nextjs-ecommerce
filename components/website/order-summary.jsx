"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateVerifiedCart } from "@/redux/features/cartSlice";
import CouponForm from "./coupon-form";

const OrderSummary = () => {
	const dispatch = useDispatch();
	const cartState = useSelector((store) => store.cart);
	const cart = cartState.cart;

	const [couponDiscount, setCouponDiscount] = useState(0);
	const [appliedCoupon, setAppliedCoupon] = useState(null);

	const cartItems = JSON.stringify(cart);

	const subtotal = useMemo(() => {
		return cart.reduce(
			(acc, item) =>
				acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
			0,
		);
	}, [cart]);

	useEffect(() => {
		const products = JSON.parse(cartItems);
		const verifyCart = async () => {
			try {
				const payload = { products };
				const response = await axios.post("/api/cart/verification", payload);
				if (response.data.success) {
					dispatch(updateVerifiedCart(response.data));
				}
			} catch (error) {
				console.error("Cart verification failed:", error);
			}
		};
		verifyCart();
	}, [cartItems, dispatch]);

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
