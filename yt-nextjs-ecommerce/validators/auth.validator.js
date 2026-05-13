import { z } from "zod";

export const registerSchema = z.object({
	email: z.string().email("Địa chỉ email không hợp lệ"),
	name: z.string().min(3, "Tên phải có ít nhất 3 ký tự"),
	password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});
