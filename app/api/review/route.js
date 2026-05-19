import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectMongoDB from "@/lib/dbConnection";
import ReviewModel from "@/models/review.model";

// API danh sách đánh giá với lọc và phân trang
export async function GET(request) {
  try {
    await connectMongoDB();
    await isAuthenticated("admin");

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const globalFilter = searchParams.get("globalFilter") || "";
    const deleteType = searchParams.get("deleteType") || "SD";
    const sortingRaw = searchParams.get("sorting") || "";

    const skip = (page - 1) * limit;
    const filter = {};

    if (deleteType === "SD") {
      filter.deletedAt = null;
    } else {
      filter.deletedAt = { $ne: null };
    }

    if (globalFilter) {
      const regex = new RegExp(globalFilter, "i");
      filter.$or = [{ title: regex }, { review: regex }];
    }

    let sortField = "createdAt";
    let sortOrder = -1;
    try {
      const sorting = JSON.parse(sortingRaw);
      if (Array.isArray(sorting) && sorting.length > 0) {
        sortField = sorting[0].id;
        sortOrder = sorting[0].desc ? -1 : 1;
      }
    } catch {}

    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          as: "product",
          foreignField: "_id",
          from: "products",
          localField: "productId",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          as: "user",
          foreignField: "_id",
          from: "users",
          localField: "userId",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $sort: { [sortField]: sortOrder } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          createdAt: 1,
          deletedAt: 1,
          "product.name": 1,
          rating: 1,
          review: 1,
          title: 1,
          "user.email": 1,
          "user.name": 1,
        },
      },
    ];

    const [reviews, total] = await Promise.all([
      ReviewModel.aggregate(pipeline),
      ReviewModel.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: reviews,
      success: true,
      total,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 },
    );
  }
}
