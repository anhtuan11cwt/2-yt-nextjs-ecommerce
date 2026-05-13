"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ButtonLoading from "@/components/application/ButtonLoading";
import UpdatePassword from "@/components/application/UpdatePassword";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { resetPasswordSchema } from "@/validators/auth.validator";

export default function ResetPasswordPage() {
	const [step, setStep] = useState("email");
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [token, setToken] = useState("");
	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(resetPasswordSchema),
	});

	const handleSendOtp = async (data) => {
		try {
			setLoading(true);
			const response = await axios.post(
				"/api/auth/reset-password/send-otp",
				data,
			);
			toast.success(response.data.message);
			setEmail(data.email);
			setStep("otp");
		} catch (error) {
			toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOtp = async () => {
		try {
			setLoading(true);
			const response = await axios.post("/api/auth/reset-password/verify-otp", {
				email,
				otp,
			});
			toast.success(response.data.message);
			setToken(response.data.data.token);
			setStep("update");
		} catch (error) {
			toast.error(error?.response?.data?.message || "Mã OTP không hợp lệ");
		} finally {
			setLoading(false);
		}
	};

	if (step === "otp") {
		return (
			<Card>
				<CardHeader className="space-y-4">
					<div className="flex justify-center">
						<Image alt="logo" height={70} src="/vercel.svg" width={70} />
					</div>
					<div className="text-center">
						<CardTitle className="text-2xl">Xác thực OTP</CardTitle>
						<CardDescription>
							Nhập mã 6 chữ số đã được gửi đến email của bạn
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="space-y-5">
					<div className="flex justify-center">
						<InputOTP
							maxLength={6}
							onChange={(value) => setOtp(value)}
							value={otp}
						>
							<InputOTPGroup>
								<InputOTPSlot index={0} />
								<InputOTPSlot index={1} />
								<InputOTPSlot index={2} />
								<InputOTPSlot index={3} />
								<InputOTPSlot index={4} />
								<InputOTPSlot index={5} />
							</InputOTPGroup>
						</InputOTP>
					</div>

					<ButtonLoading
						loading={loading}
						onClick={handleVerifyOtp}
						text="Xác thực OTP"
						type="button"
					/>

					<div className="text-center">
						<button
							className="text-sm text-violet-600 hover:underline disabled:opacity-50"
							disabled={loading}
							onClick={() => setStep("email")}
							type="button"
						>
							Quay lại
						</button>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (step === "update") {
		return <UpdatePassword token={token} />;
	}

	return (
		<Card>
			<CardHeader className="space-y-4">
				<div className="flex justify-center">
					<Image alt="logo" height={70} src="/vercel.svg" width={70} />
				</div>
				<div className="text-center">
					<CardTitle className="text-2xl">Quên mật khẩu</CardTitle>
					<CardDescription>
						Nhập email của bạn để nhận mã OTP đặt lại mật khẩu
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<form className="space-y-5" onSubmit={handleSubmit(handleSendOtp)}>
					<div>
						<label className="text-sm font-medium" htmlFor="email">
							Email
						</label>
						<input
							className="mt-2 h-11 w-full rounded-md border px-4 disabled:opacity-50"
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

					<ButtonLoading loading={loading} text="Gửi OTP" type="submit" />

					<div className="text-center text-sm">
						<Link
							className="font-medium text-violet-600 hover:underline"
							href="/login"
						>
							Quay lại đăng nhập
						</Link>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
