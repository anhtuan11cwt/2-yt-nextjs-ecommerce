import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnection";
import stripe from "@/lib/stripe";
import Order from "@/models/order.model";

export async function POST(req) {
	try {
		await connectDB();

		const body = await req.json();
		const { sessionId } = body;

		if (!sessionId) {
			return NextResponse.json(
				{ message: "Thiếu session ID", success: false },
				{ status: 400 },
			);
		}

		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status !== "paid") {
			return NextResponse.json(
				{ message: "Thanh toán chưa hoàn tất", success: false },
				{ status: 400 },
			);
		}

		const order = await Order.findOneAndUpdate(
			{ stripeSessionId: sessionId },
			{
				orderStatus: "Processing",
				paymentStatus: "Paid",
				stripePaymentIntentId: session.payment_intent,
			},
			{ new: true },
		);

		if (!order) {
			return NextResponse.json(
				{ message: "Không tìm thấy đơn hàng", success: false },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			order: {
				_id: order._id,
				orderStatus: order.orderStatus,
				paymentStatus: order.paymentStatus,
				totalAmount: order.totalAmount,
			},
			success: true,
		});
	} catch (_error) {
		return NextResponse.json(
			{ message: "Lỗi xác nhận đơn hàng", success: false },
			{ status: 500 },
		);
	}
}
