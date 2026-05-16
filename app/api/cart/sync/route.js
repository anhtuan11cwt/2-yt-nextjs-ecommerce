import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import Cart from "@/models/cart.model";

export async function POST(req) {
	try {
		await connectDB();
		const user = await isAuthenticated();
		const body = await req.json();
		const { items } = body;

		if (!items || !Array.isArray(items)) {
			return NextResponse.json(
				{ message: "Dữ liệu không hợp lệ", success: false },
				{ status: 400 },
			);
		}

		const mappedItems = items
			.filter((item) => item.variantId && item.quantity > 0)
			.map((item) => ({
				product: item.productId,
				quantity: item.quantity,
				variant: item.variantId,
			}));

		await Cart.findOneAndUpdate(
			{ user: user._id },
			{ items: mappedItems },
			{ upsert: true },
		);

		return NextResponse.json({ success: true });
	} catch (_error) {
		return NextResponse.json(
			{ message: "Lỗi đồng bộ giỏ hàng", success: false },
			{ status: 500 },
		);
	}
}
