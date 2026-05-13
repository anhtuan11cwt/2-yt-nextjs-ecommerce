"use client";

import axios from "axios";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";

export default function VerifyEmailPage() {
	const params = useParams();
	const token = params.token;

	const [loading, setLoading] = useState(true);
	const [success, setSuccess] = useState(false);
	const [message, setMessage] = useState("");

	const verifyEmail = useEffectEvent(async (currentToken) => {
		try {
			setLoading(true);
			const response = await axios.get(
				`/api/auth/verify-email?token=${currentToken}`,
			);
			setSuccess(true);
			setMessage(response.data.message);
		} catch (error) {
			setSuccess(false);
			setMessage(error.response?.data?.message || "Xác thực email thất bại");
		} finally {
			setLoading(false);
		}
	});

	useEffect(() => {
		if (!token) {
			return;
		}

		const timeoutId = setTimeout(() => {
			void verifyEmail(token);
		}, 0);

		return () => clearTimeout(timeoutId);
	}, [token]);

	if (loading) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4">
				<Loader2 className="h-12 w-12 animate-spin text-violet-600" />
				<h1 className="text-2xl font-semibold">Đang xác thực email...</h1>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xl">
				<div className="mb-6 flex justify-center">
					{success ? (
						<CheckCircle2 className="h-20 w-20 text-green-500" />
					) : (
						<XCircle className="h-20 w-20 text-red-500" />
					)}
				</div>

				<h1 className="mb-4 text-3xl font-bold">
					{success ? "Email Đã Được Xác Thực" : "Xác Thực Thất Bại"}
				</h1>

				<p className="mb-6 text-gray-600">{message}</p>

				<Link
					className="inline-block rounded-xl bg-violet-600 px-6 py-3 text-white transition hover:bg-violet-700"
					href="/"
				>
					Tiếp Tục Mua Sắm
				</Link>
			</div>
		</div>
	);
}
