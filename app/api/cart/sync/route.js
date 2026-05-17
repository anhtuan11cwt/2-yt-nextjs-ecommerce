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

		const existingCart = await Cart.findOne({ user: user._id });

		if (existingCart) {
			const existingItemsMap = new Map();
			existingCart.items.forEach((item) => {
				const key = `${item.product.toString()}-${item.variant.toString()}`;
				existingItemsMap.set(key, item);
			});

			mappedItems.forEach((newItem) => {
				const key = `${newItem.product.toString()}-${newItem.variant.toString()}`;
				const existingItem = existingItemsMap.get(key);

				if (existingItem) {
					existingItem.quantity = Math.max(
						existingItem.quantity,
						newItem.quantity,
					);
				} else {
					existingCart.items.push(newItem);
				}
			});

			await existingCart.save();
		} else {
			await Cart.create({ items: mappedItems, user: user._id });
		}

		return NextResponse.json({ success: true });
	} catch (_error) {
		return NextResponse.json(
			{ message: "Lỗi đồng bộ giỏ hàng", success: false },
			{ status: 500 },
		);
	}
}
