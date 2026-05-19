"use client";

import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Slider from "react-slick";

import Slider1 from "@/public/assets/images/slider-1.png";
import Slider2 from "@/public/assets/images/slider-2.png";
import Slider3 from "@/public/assets/images/slider-3.png";
import Slider4 from "@/public/assets/images/slider-4.png";

const sliderData = [
  { id: 1, image: Slider1 },
  { id: 2, image: Slider2 },
  { id: 3, image: Slider3 },
  { id: 4, image: Slider4 },
];

function NextArrow({ onClick }) {
  return (
    <button
      className="absolute right-5 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-3 text-black shadow-lg transition hover:bg-primary hover:text-white"
      onClick={onClick}
      type="button"
    >
      <IoIosArrowForward size={24} />
    </button>
  );
}

function PrevArrow({ onClick }) {
  return (
    <button
      className="absolute left-5 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-3 text-black shadow-lg transition hover:bg-primary hover:text-white"
      onClick={onClick}
      type="button"
    >
      <IoIosArrowBack size={24} />
    </button>
  );
}

export default function MainSlider() {
  const settings = {
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
    infinite: true,
    nextArrow: <NextArrow />,
    pauseOnHover: false,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          dots: false,
        },
      },
    ],
    slidesToScroll: 1,
    slidesToShow: 1,
    speed: 500,
  };

  return (
    <section className="overflow-hidden">
      <Slider {...settings}>
        {sliderData.map((item) => (
          <div key={item.id}>
            <div className="relative w-full" style={{ aspectRatio: "192/65" }}>
              <Image
                alt="slider"
                className="object-cover"
                fill
                priority
                src={item.image}
              />
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}
