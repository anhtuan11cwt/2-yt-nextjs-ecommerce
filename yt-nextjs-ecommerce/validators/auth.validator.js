import { z } from "zod";

export const registerSchema = z.object({
	email: z.string().email("Địa chỉ email không hợp lệ"),
	name: z.string().min(3, "Tên phải có ít nhất 3 ký tự"),
	password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const loginSchema = z.object({
	email: z
		.string()
		.min(1, "Email là bắt buộc")
		.email("Nhập địa chỉ email hợp lệ"),

	password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const verifyOtpSchema = z.object({
	email: z.string().email("Địa chỉ email không hợp lệ"),
	otp: z.string().length(6, "Mã OTP phải có 6 ký tự"),
});

export const resetPasswordSchema = z.object({
	email: z
		.string()
		.min(1, "Email là bắt buộc")
		.email("Nhập địa chỉ email hợp lệ"),
});

export const updatePasswordSchema = z
	.object({
		confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
		password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Mật khẩu xác nhận không khớp",
		path: ["confirmPassword"],
	});
