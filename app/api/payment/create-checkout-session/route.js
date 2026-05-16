import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnection";
import stripe from "@/lib/stripe";
import Order from "@/models/order.model";

export async function POST(req) {
	try {
		await connectDB();

		const body = await req.json();
		const {
			products,
			shippingAddress,
			orderNote,
			couponDiscount,
			couponCode,
			userId,
		} = body;

		if (!products?.length || !shippingAddress) {
			return NextResponse.json(
				{ message: "Dữ liệu không hợp lệ", success: false },
				{ status: 400 },
			);
		}

		const subtotalBeforeDiscount = products.reduce(
			(sum, item) =>
				sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
			0,
		);

		const totalDiscount = couponDiscount || 0;
		const totalAmount = subtotalBeforeDiscount - totalDiscount;

		if (totalAmount < 15000) {
			return NextResponse.json(
				{
					message:
						"Tổng tiền đơn hàng tối thiểu là ₫15,000. Vui lòng thêm sản phẩm vào giỏ hàng.",
					success: false,
				},
				{ status: 400 },
			);
		}

		let remainingDiscount = totalDiscount;

		const lineItems = products.map((item, index) => {
			const quantity = Math.round(Number(item.quantity) || 1);
			const unitPrice = Math.round(Number(item.price) || 0);
			const itemTotal = unitPrice * quantity;
			const isLast = index === products.length - 1;

			const discountForItem =
				totalDiscount <= 0 || subtotalBeforeDiscount <= 0
					? 0
					: isLast
						? remainingDiscount
						: Math.round((itemTotal / subtotalBeforeDiscount) * totalDiscount);

			remainingDiscount -= discountForItem;

			const discountedItemTotal = Math.max(itemTotal - discountForItem, 0);

			// Merge quantity into name so Stripe shows "Tên × 20: 31.240₫"
			// instead of "Số lượng 20, 1.562₫ mỗi"
			const lineName = quantity > 1 ? `${item.name} ×${quantity}` : item.name;

			return {
				price_data: {
					currency: "vnd",
					product_data: {
						images: item.image ? [item.image] : [],
						name: lineName,
					},
					unit_amount: Math.round(discountedItemTotal),
				},
				quantity: 1,
			};
		});

		const session = await stripe.checkout.sessions.create({
			cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/website/checkout?canceled=true`,
			customer_email: shippingAddress.email,
			line_items: lineItems,
			metadata: {
				couponCode: couponCode || "",
				couponDiscount: String(couponDiscount || 0),
				userId: userId || "guest",
			},
			mode: "payment",
			payment_method_types: ["card"],
			success_url: `${process.env.NEXT_PUBLIC_APP_URL}/website/order/success?session_id={CHECKOUT_SESSION_ID}`,
		});

		const orderProducts = products.map((item) => ({
			price: Number(item.price) || 0,
			product: item.productId,
			quantity: Number(item.quantity) || 1,
		}));

		await Order.create({
			couponCode: couponCode || "",
			couponDiscount: couponDiscount || 0,
			orderNote: orderNote || "",
			orderStatus: "Pending",
			paymentStatus: "Pending",
			products: orderProducts,
			shippingAddress,
			stripeSessionId: session.id,
			totalAmount,
			user: userId || null,
		});

		return NextResponse.json({ success: true, url: session.url });
	} catch (_error) {
		return NextResponse.json(
			{ message: "Lỗi tạo phiên thanh toán", success: false },
			{ status: 500 },
		);
	}
}
