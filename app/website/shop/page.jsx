"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { SlidersHorizontal, X } from "lucide-react";
import { Suspense } from "react";

import FiltersSidebar from "@/components/website/FiltersSidebar";
import ProductGrid from "@/components/website/ProductGrid";
import WebsiteBreadcrumb from "@/components/website/WebsiteBreadcrumb";
import useWindowSize from "@/hooks/useWindowSize";

export default function ShopPage() {
	const { width } = useWindowSize();

	return (
		<div className="min-h-screen bg-white">
			<WebsiteBreadcrumb
				links={[
					{ href: "/website", label: "Trang Chủ" },
					{ label: "Cửa Hàng" },
				]}
			/>

			<section className="px-4 py-8 lg:px-32">
				{/* Mobile Filter Button */}
				{width > 0 && width < 1024 && (
					<Suspense>
						<Dialog.Root>
							<Dialog.Trigger asChild>
								<button
									className="mb-6 flex items-center gap-2 rounded-xl border px-4 py-3"
									type="button"
								>
									<SlidersHorizontal size={18} />
									Bộ Lọc
								</button>
							</Dialog.Trigger>

							<Dialog.Portal>
								<Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />

								<Dialog.Content className="fixed left-0 top-0 z-50 h-screen w-[320px] overflow-y-auto bg-white p-5">
									<div className="mb-4 flex items-center justify-between">
										<h2 className="text-lg font-semibold">Bộ Lọc</h2>

										<Dialog.Close asChild>
											<button type="button">
												<X size={20} />
											</button>
										</Dialog.Close>
									</div>

									<FiltersSidebar />
								</Dialog.Content>
							</Dialog.Portal>
						</Dialog.Root>
					</Suspense>
				)}

				<div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
					{/* Desktop Sidebar */}
					{width >= 1024 && (
						<div className="lg:col-span-3">
							<Suspense>
								<FiltersSidebar />
							</Suspense>
						</div>
					)}

					{/* Products */}
					<div className={width >= 1024 ? "lg:col-span-9" : "col-span-1"}>
						<Suspense>
							<ProductGrid />
						</Suspense>
					</div>
				</div>
			</section>
		</div>
	);
}
