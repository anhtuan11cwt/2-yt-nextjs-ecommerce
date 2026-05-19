import mongoose from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";

import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import { prepareDescriptionForStorage } from "@/lib/product-description";
import Product from "@/models/product.model";
import { productFormSchema } from "@/validators/product.validator";

// Tính phần trăm giảm giá
function computeDiscountPercent(mrp, sellingPrice) {
  if (!(mrp > 0)) {
    return 0;
  }
  return Math.round(((mrp - sellingPrice) / mrp) * 100);
}

// API cập nhật sản phẩm
export async function PUT(request, { params }) {
  try {
    await isAuthenticated("admin");
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "ID sản phẩm không hợp lệ", success: false },
        { status: 400 },
      );
    }

    const body = await request.json();
    const parsed = productFormSchema.parse({
      category: body?.category,
      description: body?.description ?? "",
      discountPercent: body?.discountPercent ?? 0,
      media: Array.isArray(body?.media) ? body.media : [],
      mrp: body?.mrp,
      name: body?.name,
      sellingPrice: body?.sellingPrice,
    });

    const name = parsed.name.trim();
    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const duplicate = await Product.findOne({
      _id: { $ne: id },
      slug,
    });
    if (duplicate) {
      return NextResponse.json(
        { message: "Slug sản phẩm đã tồn tại", success: false },
        { status: 400 },
      );
    }

    const discountPercent = computeDiscountPercent(
      parsed.mrp,
      parsed.sellingPrice,
    );
    const descriptionStored = prepareDescriptionForStorage(parsed.description);

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        category: parsed.category,
        description: descriptionStored,
        discountPercent,
        media: parsed.media,
        mrp: parsed.mrp,
        name,
        sellingPrice: parsed.sellingPrice,
        slug,
      },
      { new: true },
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm", success: false },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: updated,
      message: "Cập nhật sản phẩm thành công",
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: error?.statusCode || 500 },
    );
  }
}
