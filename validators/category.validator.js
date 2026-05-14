import { z } from "zod";

export const categorySchema = z.object({
	name: z
		.string()
		.min(2, "Tên danh mục phải có ít nhất 2 ký tự")
		.max(100, "Tên danh mục quá dài"),
	slug: z
		.string()
		.min(2, "Slug phải có ít nhất 2 ký tự")
		.max(100, "Slug quá dài"),
});
