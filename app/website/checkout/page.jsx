"use client";

import { useState } from "react";
import CheckoutForm from "@/components/website/checkout-form";
import OrderSummary from "@/components/website/order-summary";

const CheckoutPage = () => {
	const [couponDiscount, setCouponDiscount] = useState(0);
	const [appliedCoupon, setAppliedCoupon] = useState(null);

	return (
		<div className="min-h-screen bg-neutral-50 py-10">
			<div className="max-w-7xl mx-auto px-4 lg:px-8">
				<div className="grid lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<CheckoutForm
							appliedCoupon={appliedCoupon}
							couponDiscount={couponDiscount}
						/>
					</div>
					<div>
						<OrderSummary
							appliedCoupon={appliedCoupon}
							couponDiscount={couponDiscount}
							setAppliedCoupon={setAppliedCoupon}
							setCouponDiscount={setCouponDiscount}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CheckoutPage;
