"use client";

import Rating from "@mui/material/Rating";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaStar } from "react-icons/fa6";
import { Progress } from "@/components/ui/progress";
import { reviewSchema } from "@/validators/review.validator";

dayjs.extend(relativeTime);

// Hiển thị điểm trung bình và phân bố sao
function ReviewSummary({ summary }) {
  if (!summary || summary.totalReviews === 0) {
    return (
      <div className="rounded-2xl border p-6 text-center text-gray-500">
        Chưa có đánh giá nào
      </div>
    );
  }

  return (
    <div className="grid gap-10 rounded-2xl border p-6 lg:grid-cols-2">
      <div className="space-y-4">
        <h2 className="text-5xl font-bold">{summary.averageRating}</h2>
        <div className="flex items-center gap-1 text-yellow-500">
          {[1, 2, 3, 4, 5].map((item) => (
            <FaStar key={item} size={20} />
          ))}
        </div>
        <p className="text-gray-500">
          Dựa trên {summary.totalReviews} đánh giá
        </p>
      </div>
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((star) => (
          <div className="flex items-center gap-4" key={star}>
            <span className="w-10 text-sm font-medium">{star}★</span>
            <Progress
              className="h-2"
              value={summary.percentages?.[star] || 0}
            />
            <span className="w-12 text-sm text-gray-500">
              {summary.percentages?.[star] || 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Form gửi đánh giá mới (yêu cầu đăng nhập)
function ReviewForm({ auth, productId, slug }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/review/create", {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      return response.json();
    },
    onError: () => {
      toast.error("Đã xảy ra lỗi");
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        setTitle("");
        setReview("");
        setRating(0);
        setErrors({});
        queryClient.invalidateQueries({
          queryKey: ["product-reviews", productId],
        });
      } else {
        toast.error(data.message);
      }
    },
  });

  // Validate client bằng Zod trước khi gọi API tạo review
  const handleSubmit = (e) => {
    e.preventDefault();
    const result = reviewSchema.safeParse({ rating, review, title });
    if (!result.success) {
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0]] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    mutation.mutate({
      productId,
      rating,
      review,
      title,
      userId: auth?._id || auth?.id,
    });
  };

  if (!auth) {
    return (
      <a
        className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-white"
        href={`/login?callbackUrl=/product/${slug}`}
      >
        Đăng nhập để đánh giá
      </a>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Rating onChange={(_, value) => setRating(value)} value={rating} />
        {errors.rating && (
          <p className="text-sm text-red-500">{errors.rating}</p>
        )}
      </div>
      <div className="space-y-2">
        <input
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-primary"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề đánh giá"
          type="text"
          value={title}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
      </div>
      <div className="space-y-2">
        <textarea
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-primary"
          onChange={(e) => setReview(e.target.value)}
          placeholder="Viết đánh giá của bạn..."
          rows={5}
          value={review}
        />
        {errors.review && (
          <p className="text-sm text-red-500">{errors.review}</p>
        )}
      </div>
      <button
        className="rounded-xl bg-black px-6 py-3 text-white transition-all hover:opacity-90 disabled:opacity-50"
        disabled={mutation.isPending}
        type="submit"
      >
        {mutation.isPending ? "Đang gửi..." : "Gửi Đánh Giá"}
      </button>
    </form>
  );
}

// Card hiển thị một đánh giá đơn lẻ
function ReviewItem({ review }) {
  return (
    <div className="space-y-4 rounded-2xl border p-5">
      <div className="flex items-center gap-4">
        {review?.userId?.avatar?.url ? (
          <Image
            alt="avatar"
            className="h-12 w-12 rounded-full object-cover"
            height={48}
            src={review.userId.avatar.url}
            width={48}
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
            <span className="text-lg font-semibold text-gray-500">
              {review?.userId?.name?.[0]?.toUpperCase() || "?"}
            </span>
          </div>
        )}
        <div>
          <h3 className="font-semibold">{review?.userId?.name || "Ẩn danh"}</h3>
          <p className="text-sm text-gray-500">
            {dayjs(review?.createdAt).fromNow()}
          </p>
        </div>
      </div>
      <Rating readOnly value={review?.rating} />
      <h4 className="text-lg font-semibold">{review?.title}</h4>
      <p className="leading-7 text-gray-600">{review?.review}</p>
    </div>
  );
}

// Section đánh giá sản phẩm — tổng hợp, form, danh sách phân trang
export default function ProductReview({ auth, productId, slug }) {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const response = await fetch(
        `/api/review/details?productId=${productId}&page=${page}&limit=${limit}`,
      );
      return response.json();
    },
    queryKey: ["product-reviews", productId, page],
  });

  const summary = data?.summary;
  const reviews = data?.reviews || [];
  const totalReviews = summary?.totalReviews || 0;
  const totalPages = Math.ceil(totalReviews / limit);

  return (
    <section className="mt-16 px-4 lg:px-20">
      <h2 className="mb-8 text-2xl font-bold">Đánh Giá Sản Phẩm</h2>
      <ReviewSummary summary={summary} />
      <div className="mt-10">
        <h3 className="mb-5 text-xl font-semibold">Viết Đánh Giá</h3>
        <ReviewForm auth={auth} productId={productId} slug={slug} />
      </div>
      <div className="mt-10">
        <h3 className="mb-5 text-xl font-semibold">
          Tất Cả Đánh Giá ({totalReviews})
        </h3>
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                className="h-40 animate-pulse rounded-2xl bg-gray-100"
                key={i.toString()}
              />
            ))}
          </div>
        )}
        {!isLoading && reviews.length === 0 && (
          <p className="py-10 text-center text-gray-500">
            Chưa có đánh giá nào.
          </p>
        )}
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewItem key={review._id} review={review} />
          ))}
        </div>
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              className="rounded-xl border px-4 py-2 disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              type="button"
            >
              Trước
            </button>
            <span className="px-2 font-medium">
              {page} / {totalPages}
            </span>
            <button
              className="rounded-xl border px-4 py-2 disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              type="button"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
