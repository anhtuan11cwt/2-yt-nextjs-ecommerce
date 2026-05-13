import { z } from "zod";

const name = z
	.string()
	.min(3, {
		message: "Tên phải có ít nhất 3 ký tự",
	})
	.max(30, {
		message: "Tên tối đa 30 ký tự",
	});

const email = z.string().email({
	message: "Nhập địa chỉ email hợp lệ",
});

const password = z
	.string()
	.min(6, {
		message: "Mật khẩu tối thiểu 6 ký tự",
	})
	.max(20, {
		message: "Mật khẩu tối đa 20 ký tự",
	});

const registerFields = {
	confirmPassword: z.string(),
	email,
	name,
	password,
};

export const registerSchema = z
	.object(registerFields)
	.refine((data) => data.password === data.confirmPassword, {
		message: "Mật khẩu không khớp",
		path: ["confirmPassword"],
	});

export const loginSchema = z.object({
	email,
	password,
});
