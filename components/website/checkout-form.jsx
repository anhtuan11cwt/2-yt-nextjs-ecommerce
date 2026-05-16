"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { checkoutSchema } from "@/schemas/checkoutSchema";

const CheckoutForm = () => {
	const auth = useSelector((store) => store.auth);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: auth?.user?.email || "",
			name: auth?.user?.name || "",
		},
		resolver: zodResolver(checkoutSchema),
	});

	const onSubmit = async (values) => {
		const payload = {
			...values,
			userId: auth?.user?._id || null,
		};
		console.log("Checkout payload:", payload);
	};

	return (
		<div className="bg-white border rounded-3xl p-6 lg:p-8">
			<h2 className="text-2xl font-bold mb-6">Địa chỉ giao hàng</h2>
			<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label className="block mb-2 text-sm font-medium" htmlFor="name">
						Họ và tên
					</label>
					<input
						id="name"
						type="text"
						{...register("name")}
						className="w-full border rounded-xl h-12 px-4 outline-none"
					/>
					{errors.name && (
						<p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
					)}
				</div>
				<div className="grid md:grid-cols-2 gap-5">
					<div>
						<label className="block mb-2 text-sm font-medium" htmlFor="email">
							Email
						</label>
						<input
							id="email"
							type="email"
							{...register("email")}
							className="w-full border rounded-xl h-12 px-4 outline-none"
						/>
					</div>
					<div>
						<label className="block mb-2 text-sm font-medium" htmlFor="phone">
							Số điện thoại
						</label>
						<input
							id="phone"
							type="text"
							{...register("phone")}
							className="w-full border rounded-xl h-12 px-4 outline-none"
						/>
					</div>
				</div>
				<div className="grid md:grid-cols-2 gap-5">
					<div>
						<label className="block mb-2 text-sm font-medium" htmlFor="state">
							Tỉnh/Thành phố
						</label>
						<input
							id="state"
							type="text"
							{...register("state")}
							className="w-full border rounded-xl h-12 px-4 outline-none"
						/>
					</div>
					<div>
						<label className="block mb-2 text-sm font-medium" htmlFor="city">
							Quận/Huyện
						</label>
						<input
							id="city"
							type="text"
							{...register("city")}
							className="w-full border rounded-xl h-12 px-4 outline-none"
						/>
					</div>
				</div>
				<div className="grid md:grid-cols-2 gap-5">
					<div>
						<label className="block mb-2 text-sm font-medium" htmlFor="pincode">
							Mã bưu điện
						</label>
						<input
							id="pincode"
							type="text"
							{...register("pincode")}
							className="w-full border rounded-xl h-12 px-4 outline-none"
						/>
					</div>
					<div>
						<label
							className="block mb-2 text-sm font-medium"
							htmlFor="landmark"
						>
							Địa chỉ cụ thể
						</label>
						<input
							id="landmark"
							type="text"
							{...register("landmark")}
							className="w-full border rounded-xl h-12 px-4 outline-none"
						/>
					</div>
				</div>
				<div>
					<label className="block mb-2 text-sm font-medium" htmlFor="orderNote">
						Ghi chú đơn hàng
					</label>
					<textarea
						id="orderNote"
						rows={4}
						{...register("orderNote")}
						className="w-full border rounded-xl px-4 py-3 outline-none resize-none"
					/>
				</div>
				<button
					className="h-12 px-8 rounded-xl bg-black text-white font-semibold w-full"
					type="submit"
				>
					Đặt hàng
				</button>
			</form>
		</div>
	);
};

export default CheckoutForm;
