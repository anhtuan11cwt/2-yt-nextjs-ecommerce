import BannerSection from "@/components/website/BannerSection";
import FeaturedProducts from "@/components/website/FeaturedProducts";
import MainSlider from "@/components/website/MainSlider";

export default function Home() {
	return (
		<>
			<MainSlider />
			<BannerSection />
			<FeaturedProducts />
		</>
	);
}
