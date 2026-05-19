import AdvertisingBanner from "@/components/website/advertising-banner";
import BannerSection from "@/components/website/BannerSection";
import FeaturedProducts from "@/components/website/FeaturedProducts";
import Features from "@/components/website/features";
import MainSlider from "@/components/website/MainSlider";
import Testimonial from "@/components/website/testimonial";

export default function Home() {
  return (
    <>
      <MainSlider />
      <BannerSection />
      <FeaturedProducts />
      <AdvertisingBanner />
      <Testimonial />
      <Features />
    </>
  );
}
