import Image from "next/image";

import BannerOne from "@/public/assets/images/banner1.png";
import BannerTwo from "@/public/assets/images/banner2.png";

export default function BannerSection() {
	return (
		<section className="px-4 pb-10 pt-5 sm:px-32 sm:pt-20">
			<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-10">
				<div className="group overflow-hidden rounded-lg">
					<Image
						alt="banner 1"
						className="h-auto w-full transition-all duration-500 group-hover:scale-105"
						height={400}
						src={BannerOne}
						width={800}
					/>
				</div>
				<div className="group overflow-hidden rounded-lg">
					<Image
						alt="banner 2"
						className="h-auto w-full transition-all duration-500 group-hover:scale-105"
						height={400}
						src={BannerTwo}
						width={800}
					/>
				</div>
			</div>
		</section>
	);
}
