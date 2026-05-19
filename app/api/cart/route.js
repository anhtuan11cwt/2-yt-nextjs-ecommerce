import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import Cart from "@/models/cart.model";

export async function GET() {
  try {
    await connectDB();
    const user = await isAuthenticated();
    const cart = await Cart.findOne({ user: user._id }).populate({
      model: "ProductVariant",
      path: "items.variant",
      populate: [
        { model: "Product", path: "product" },
        { model: "Media", path: "media" },
      ],
    });

    if (!cart) {
      return NextResponse.json({ cart: [], success: true });
    }

    const items = cart.items || [];

    const formatted = items.map((item) => ({
      color: item.variant.color,
      image: item.variant.media?.[0]?.path || "",
      name: item.variant.product.name,
      price: item.variant.product.sellingPrice,
      productId: item.variant.product._id,
      quantity: item.quantity,
      size: item.variant.size,
      slug: item.variant.product.slug,
      stock: item.variant.quantity,
      subtotal: item.variant.product.sellingPrice * item.quantity,
      variantId: item.variant._id,
    }));

    return NextResponse.json({ cart: formatted, success: true });
  } catch (_error) {
    return NextResponse.json({ cart: [], success: true });
  }
}
