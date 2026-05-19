import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnection";
import MediaModel from "@/models/media.model";
import OrderModel from "@/models/order.model";
import ProductModel from "@/models/product.model";
import ProductVariantModel from "@/models/productVariant.model";

export async function GET(_request, { params }) {
  try {
    await connectDB();

    const { orderId } = await params;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { message: "ID đơn hàng không hợp lệ", success: false },
        { status: 400 },
      );
    }

    const order = await OrderModel.findById(orderId)
      .populate({
        model: ProductModel,
        path: "products.product",
        select: "name slug",
      })
      .populate({
        model: ProductVariantModel,
        path: "products.variant",
        populate: {
          model: MediaModel,
          path: "media",
          select: "alt path thumbnailUrl",
        },
      })
      .lean();

    if (!order) {
      return NextResponse.json(
        { message: "Không tìm thấy đơn hàng", success: false },
        { status: 404 },
      );
    }

    return NextResponse.json({ order, success: true }, { status: 200 });
  } catch (error) {
    console.error("Lỗi API Order Details:", error);
    return NextResponse.json(
      { message: "Lỗi hệ thống phía Server", success: false },
      { status: 500 },
    );
  }
}
