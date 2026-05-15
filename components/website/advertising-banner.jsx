import Image from "next/image";

export default function AdvertisingBanner() {
	return (
		<section className="w-full py-10 lg:py-16">
			<div className="max-w-7xl mx-auto px-4 lg:px-8">
				<div className="relative overflow-hidden rounded-[32px]">
					<Image
						alt="Advertising Banner"
						className="w-full h-[250px] lg:h-[420px] object-cover hover:scale-105 transition-all duration-700"
						height={420}
						src="/assets/images/advertising-banner.png"
						width={1280}
					/>
					<div className="absolute inset-0 bg-black/40 flex items-center">
						<div className="px-8 lg:px-16 text-white max-w-2xl">
							<p className="uppercase tracking-[5px] text-sm mb-4">
								Bộ Sưu Tập Mới
							</p>
							<h2 className="text-3xl lg:text-6xl font-bold leading-tight">
								Khám Phá Phong Cách Thời Trang Đường Phố
							</h2>
							<button
								className="mt-6 bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300"
								type="button"
							>
								Mua Sắm Ngay
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
