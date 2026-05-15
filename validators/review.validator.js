import z from "zod";

// Schema validate form đánh giá sản phẩm
export const reviewSchema = z.object({
	rating: z.number().min(1, "Vui lòng chọn số sao"),
	review: z.string().min(10, "Nội dung đánh giá quá ngắn"),
	title: z.string().min(3, "Tiêu đề là bắt buộc"),
});
