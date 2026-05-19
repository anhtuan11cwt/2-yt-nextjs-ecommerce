import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectDB from "@/lib/dbConnection";
import ReviewModel from "@/models/review.model";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

function mediaThumbUrl(doc) {
  if (!doc) return null;
  if (doc.thumbnailUrl) return doc.thumbnailUrl;
  if (doc.path && CLOUD)
    return `https://res.cloudinary.com/${CLOUD}/image/upload/${doc.path}`;
  return null;
}

// API 6 đánh giá mới nhất
export async function GET() {
  try {
    await connectDB();
    await isAuthenticated("admin");

    const pipeline = [
      { $match: { deletedAt: null } },
      { $sort: { createdAt: -1 } },
      { $limit: 6 },
      {
        $lookup: {
          as: "productData",
          foreignField: "_id",
          from: "products",
          localField: "productId",
        },
      },
      { $unwind: { path: "$productData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          as: "productData.media",
          foreignField: "_id",
          from: "media",
          localField: "productData.media",
        },
      },
      {
        $lookup: {
          as: "userData",
          foreignField: "_id",
          from: "users",
          localField: "userId",
        },
      },
      { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          createdAt: 1,
          "productData.media": 1,
          "productData.name": 1,
          productId: 1,
          rating: 1,
          review: 1,
          title: 1,
          "userData.name": 1,
          userId: 1,
        },
      },
    ];

    const reviews = await ReviewModel.aggregate(pipeline);

    const formatted = reviews.map((review) => ({
      ...review,
      productId: review.productData
        ? { media: review.productData.media, name: review.productData.name }
        : null,
      thumbnail: mediaThumbUrl(review.productData?.media?.[0]),
      userId: review.userData ? { name: review.userData.name } : null,
    }));

    return NextResponse.json({ data: formatted, success: true });
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 },
    );
  }
}
