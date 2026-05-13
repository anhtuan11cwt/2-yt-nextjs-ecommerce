"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import ButtonLoading from "@/components/application/ButtonLoading";
import OtpVerification from "@/components/application/OtpVerification";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { loginSchema } from "@/validators/auth.validator";

export default function LoginPage() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [showOtpForm, setShowOtpForm] = useState(false);
	const [userEmail, setUserEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data) => {
		try {
			setIsSubmitting(true);
			const response = await axios.post("/api/auth/login", data);
			toast.success(response.data.message || "OTP đã được gửi!");
			setUserEmail(data.email);
			setShowOtpForm(true);
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleVerifySuccess = (data) => {
		if (data.data.user.role === "admin") {
			router.push("/admin");
		} else {
			router.push("/");
		}
	};

	return (
		<Card>
			<CardHeader className="space-y-4">
				<div className="flex justify-center">
					<Image alt="logo" height={70} src="/vercel.svg" width={70} />
				</div>

				<div className="text-center">
					{!showOtpForm && (
						<CardTitle className="text-2xl">Đăng Nhập</CardTitle>
					)}

					{!showOtpForm && (
						<CardDescription>Đăng nhập để tiếp tục mua sắm</CardDescription>
					)}
				</div>
			</CardHeader>

			<CardContent>
				{!showOtpForm ? (
					<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
						<div>
							<label className="text-sm font-medium" htmlFor="email">
								Email
							</label>

							<input
								className="mt-2 h-11 w-full rounded-md border px-4 disabled:opacity-50"
								disabled={isSubmitting}
								id="email"
								placeholder="Nhập email của bạn"
								type="email"
								{...register("email")}
							/>

							{errors.email && (
								<p className="mt-1 text-sm text-red-500">
									{errors.email.message}
								</p>
							)}
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label className="text-sm font-medium" htmlFor="password">
									Mật khẩu
								</label>
							</div>

							<div className="relative mt-2">
								<input
									className="h-11 w-full rounded-md border px-4 pr-12 disabled:opacity-50"
									disabled={isSubmitting}
									id="password"
									placeholder="Nhập mật khẩu"
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

						<ButtonLoading
							loading={isSubmitting}
							text="Đăng Nhập"
							type="submit"
						/>

						<div className="text-center text-sm">
							Chưa có tài khoản?{" "}
							<Link
								className={`font-medium text-primary ${isSubmitting ? "pointer-events-none opacity-50" : ""}`}
								href="/register"
							>
								Tạo Tài Khoản
							</Link>
						</div>
					</form>
				) : (
					<OtpVerification
						email={userEmail}
						onVerifySuccess={handleVerifySuccess}
					/>
				)}
			</CardContent>
		</Card>
	);
}
