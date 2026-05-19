import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import Cart from "@/models/cart.model";

// Xóa toàn bộ giỏ hàng của user trên server
export async function DELETE() {
  try {
    await connectDB();
    const user = await isAuthenticated();

    await Cart.findOneAndDelete({ user: user._id });

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { message: "Lỗi xóa giỏ hàng", success: false },
      { status: 500 },
    );
  }
}
