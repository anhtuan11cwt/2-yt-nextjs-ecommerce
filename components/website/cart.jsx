"use client";

import Image from "next/image";
import Link from "next/link";
import { BsBag } from "react-icons/bs";
import { FiMinus, FiPlus } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	decreaseQuantity,
	increaseQuantity,
	removeFromCart,
} from "@/redux/features/cartSlice";

const CLOUDINARY_BASE_URL =
	"https://res.cloudinary.com/deef71c3q/image/upload/";

const WebsiteCart = () => {
	const dispatch = useDispatch();

	const cart = useSelector((store) => store.cart.cart);

	const count = cart.reduce(
		(total, item) => total + Math.max(Number(item.quantity) || 1, 0),
		0,
	);

	const subtotal = cart.reduce((total, item) => {
		return total + (Number(item.price) || 0) * (Number(item.quantity) || 1);
	}, 0);

	const total = subtotal;

	const formatPrice = (price) => {
		return Number(price).toLocaleString("vi-VN", {
			currency: "VND",
			style: "currency",
		});
	};

	return (
		<Sheet>
			<SheetTrigger asChild>
				<button
					className="relative cursor-pointer text-gray-700 hover:text-primary transition-all"
					type="button"
				>
					<BsBag size={24} />

					{count > 0 && (
						<span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
							{count}
						</span>
					)}
				</button>
			</SheetTrigger>

			<SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
				<SheetHeader className="border-b px-6 py-4">
					<SheetTitle className="text-xl font-semibold">
						Giỏ hàng ({count})
					</SheetTitle>
				</SheetHeader>

				{cart.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-4">
						<BsBag className="text-gray-300" size={60} />
						<h3 className="text-xl font-semibold">Giỏ hàng trống</h3>
						<p className="text-gray-500 text-sm">Thêm sản phẩm vào giỏ hàng</p>
					</div>
				) : (
					<div className="flex flex-col flex-1 overflow-hidden">
						<div className="flex-1 overflow-y-auto px-6 py-4">
							{cart.map((item) => (
								<div
									className="flex gap-4 border-b pb-5 mb-5"
									key={item.variantId}
								>
									<div className="relative w-24 h-28 rounded-lg overflow-hidden bg-gray-100">
										<Image
											alt={item.name || "Sản phẩm"}
											className="object-cover"
											fill
											src={
												item.image.startsWith("http")
													? item.image
													: `${CLOUDINARY_BASE_URL}${item.image}`
											}
										/>
									</div>

									<div className="flex-1">
										<Link
											className="font-semibold line-clamp-2 hover:text-primary transition-all"
											href={`/product/${item.slug}`}
										>
											{item.name}
										</Link>

										<div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
											<span>Kích thước: {item.size}</span>
											<span className="capitalize">Màu sắc: {item.color}</span>
										</div>

										<div className="flex items-center gap-2 mt-2">
											<span className="font-semibold text-primary">
												{formatPrice(item.price)}
											</span>
										</div>

										<div className="flex items-center gap-3 mt-4">
											<button
												className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 transition-all"
												onClick={() =>
													dispatch(decreaseQuantity(item.variantId))
												}
												type="button"
											>
												<FiMinus size={14} />
											</button>

											<span className="font-medium">{item.quantity}</span>

											<button
												className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 transition-all"
												onClick={() =>
													dispatch(increaseQuantity(item.variantId))
												}
												type="button"
											>
												<FiPlus size={14} />
											</button>
										</div>

										<button
											className="mt-4 text-red-500 hover:text-red-600 transition-all"
											onClick={() => dispatch(removeFromCart(item.variantId))}
											type="button"
										>
											<RiDeleteBin6Line size={20} />
										</button>
									</div>
								</div>
							))}
						</div>

						<div className="border-t p-6 space-y-4 bg-white shrink-0">
							<div className="flex items-center justify-between">
								<span className="text-gray-500">Tổng cộng</span>
								<span className="font-medium text-lg">
									{formatPrice(total)}
								</span>
							</div>

							<Link
								className="w-full h-12 rounded-xl bg-primary text-white flex items-center justify-center font-medium hover:opacity-90 transition-all"
								href="/website/cart"
							>
								Xem giỏ hàng
							</Link>

							<Link
								className="w-full h-12 rounded-xl border flex items-center justify-center font-medium hover:bg-gray-50 transition-all"
								href="/website/shop"
							>
								Tiếp tục mua sắm
							</Link>
						</div>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
};

export default WebsiteCart;
