"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { FiEye, FiEyeOff } from "react-icons/fi";
import ButtonLoading from "@/components/application/ButtonLoading";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { loginSchema } from "@/validators/auth.validator";

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		mode: "onChange",
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data) => {
		try {
			const response = await axios.post("/api/auth/login", data);
			toast.success(response.data.message || "Đăng nhập thành công!");
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
			);
		}
	};

	return (
		<Card>
			<CardHeader className="space-y-4">
				<div className="flex justify-center">
					<Image alt="logo" height={70} src="/vercel.svg" width={70} />
				</div>

				<div className="text-center">
					<CardTitle className="text-2xl">Đăng Nhập</CardTitle>

					<CardDescription>Đăng nhập để tiếp tục mua sắm</CardDescription>
				</div>
			</CardHeader>

			<CardContent>
				<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
					<div>
						<label className="font-medium text-sm" htmlFor="email">
							Email
						</label>

						<input
							className="mt-2 px-4 border rounded-md w-full h-11 disabled:opacity-50"
							disabled={isSubmitting}
							id="email"
							placeholder="Nhập email của bạn"
							type="email"
							{...register("email")}
						/>

						{errors.email && (
							<p className="mt-1 text-red-500 text-sm">
								{errors.email.message}
							</p>
						)}
					</div>

					<div>
						<div className="flex items-center justify-between">
							<label className="font-medium text-sm" htmlFor="password">
								Mật khẩu
							</label>

							<Link
								className="text-sm text-primary hover:underline"
								href="/forgot-password"
							>
								Quên mật khẩu?
							</Link>
						</div>

						<div className="relative mt-2">
							<input
								className="px-4 pr-12 border rounded-md w-full h-11 disabled:opacity-50"
								disabled={isSubmitting}
								id="password"
								placeholder="Nhập mật khẩu"
								type={showPassword ? "text" : "password"}
								{...register("password")}
							/>

							<button
								className="top-1/2 right-4 absolute -translate-y-1/2 disabled:opacity-50"
								disabled={isSubmitting}
								onClick={() => setShowPassword(!showPassword)}
								type="button"
							>
								{showPassword ? (
									<FiEyeOff size={20} />
								) : (
									<FiEye size={20} />
								)}
							</button>
						</div>

						{errors.password && (
							<p className="mt-1 text-red-500 text-sm">
								{errors.password.message}
							</p>
						)}
					</div>

					<ButtonLoading
						loading={isSubmitting}
						text="Đăng Nhập"
						type="submit"
					/>

					<div className="text-sm text-center">
						Chưa có tài khoản?{" "}
						<Link
							className={`font-medium text-primary ${isSubmitting ? "pointer-events-none opacity-50" : ""}`}
							href="/register"
						>
							Tạo Tài Khoản
						</Link>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}