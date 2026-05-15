"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { updatePasswordSchema } from "@/validators/auth.validator";

// Form cập nhật mật khẩu mới
export default function UpdatePassword({ token }) {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(updatePasswordSchema),
	});

	// Gửi mật khẩu mới lên server
	const onSubmit = async (data) => {
		try {
			const response = await axios.put(
				"/api/auth/reset-password/update-password",
				{ password: data.password, token },
			);
			toast.success(response.data.message);
			router.push("/login");
		} catch (error) {
			toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
		}
	};

	return (
		<Card>
			<CardHeader className="space-y-4">
				<div className="flex justify-center">
					<Image alt="logo" height={70} src="/vercel.svg" width={70} />
				</div>
				<div className="text-center">
					<CardTitle className="text-2xl">Đặt lại mật khẩu</CardTitle>
					<CardDescription>
						Nhập mật khẩu mới cho tài khoản của bạn
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
					<div>
						<label className="text-sm font-medium" htmlFor="password">
							Mật khẩu mới
						</label>
						<div className="relative mt-2">
							<input
								className="h-11 w-full rounded-md border px-4 pr-12 disabled:opacity-50"
								disabled={isSubmitting}
								id="password"
								placeholder="Nhập mật khẩu mới"
								type={showPassword ? "text" : "password"}
								{...register("password")}
							/>
							<button
								className="absolute right-4 top-1/2 -translate-y-1/2 disabled:opacity-50"
								disabled={isSubmitting}
								onClick={() => setShowPassword(!showPassword)}
								type="button"
							>
								{showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
							</button>
						</div>
						{errors.password && (
							<p className="mt-1 text-sm text-red-500">
								{errors.password.message}
							</p>
						)}
					</div>

					<div>
						<label className="text-sm font-medium" htmlFor="confirmPassword">
							Xác nhận mật khẩu
						</label>
						<div className="relative mt-2">
							<input
								className="h-11 w-full rounded-md border px-4 pr-12 disabled:opacity-50"
								disabled={isSubmitting}
								id="confirmPassword"
								placeholder="Xác nhận mật khẩu"
								type={showPassword ? "text" : "password"}
								{...register("confirmPassword")}
							/>
							<button
								className="absolute right-4 top-1/2 -translate-y-1/2 disabled:opacity-50"
								disabled={isSubmitting}
								onClick={() => setShowPassword(!showPassword)}
								type="button"
							>
								{showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
							</button>
						</div>
						{errors.confirmPassword && (
							<p className="mt-1 text-sm text-red-500">
								{errors.confirmPassword.message}
							</p>
						)}
					</div>

					<ButtonLoading
						loading={isSubmitting}
						text="Cập nhật mật khẩu"
						type="submit"
					/>
				</form>
			</CardContent>
		</Card>
	);
}
