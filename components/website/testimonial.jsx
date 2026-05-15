"use client";

import { IoStar } from "react-icons/io5";
import { RiDoubleQuotesL } from "react-icons/ri";
import Slider from "react-slick";

const testimonials = [
	{
		name: "Nguyễn Minh Anh",
		rating: 5,
		review:
			"Chất lượng áo cực kỳ tốt, form mặc lên rất đẹp và giao hàng nhanh.",
	},
	{
		name: "Trần Hoàng Nam",
		rating: 5,
		review: "Mình rất thích chất liệu hoodie ở đây, mặc thoải mái và dày dặn.",
	},
	{
		name: "Lê Gia Hân",
		rating: 4,
		review: "Đóng gói cẩn thận, support nhiệt tình, chắc chắn sẽ mua lại.",
	},
	{
		name: "Phạm Quốc Bảo",
		rating: 5,
		review: "Thiết kế oversize rất đẹp, mặc lên cực trendy.",
	},
	{
		name: "Đặng Khánh Linh",
		rating: 5,
		review: "Áo đúng như hình, màu sắc đẹp và chất vải mềm.",
	},
	{
		name: "Võ Thành Đạt",
		rating: 4,
		review: "Shop xử lý đơn nhanh, sản phẩm chất lượng trong tầm giá.",
	},
	{
		name: "Bùi Thiên Kim",
		rating: 5,
		review: "Mình rất ưng ý phần in áo, sắc nét và không bị bong tróc.",
	},
	{
		name: "Ngô Đức Huy",
		rating: 5,
		review: "Form polo mặc khá sang, phù hợp đi làm lẫn đi chơi.",
	},
	{
		name: "Phan Nhật Minh",
		rating: 4,
		review: "Giá hợp lý, nhiều mẫu đẹp và dễ phối đồ.",
	},
	{
		name: "Dương Mỹ Tiên",
		rating: 5,
		review: "Đây là lần thứ 3 mình mua ở shop, vẫn rất hài lòng.",
	},
];

const settings = {
	arrows: false,
	autoplay: true,
	autoplaySpeed: 3500,
	dots: true,
	infinite: true,
	responsive: [
		{ breakpoint: 1024, settings: { slidesToShow: 2 } },
		{ breakpoint: 768, settings: { dots: false, slidesToShow: 1 } },
	],
	slidesToScroll: 1,
	slidesToShow: 3,
	speed: 500,
};

export default function Testimonial() {
	return (
		<section className="w-full py-16 bg-neutral-50 overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 lg:px-8">
				<div className="text-center mb-12">
					<p className="text-sm uppercase tracking-[5px] text-primary font-semibold">
						Đánh Giá
					</p>
					<h2 className="text-3xl lg:text-5xl font-bold mt-4">
						Khách Hàng Nói Gì Về Chúng Tôi
					</h2>
				</div>

				<Slider {...settings}>
					{testimonials.map((item) => (
						<div className="px-3" key={item.name}>
							<div className="bg-white rounded-3xl p-8 shadow-sm border h-full min-h-[280px] flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
								<div>
									<RiDoubleQuotesL className="text-5xl text-primary/20 mb-4" />
									<p className="text-neutral-600 leading-7">{item.review}</p>
								</div>
								<div className="mt-8">
									<h4 className="font-bold text-lg">{item.name}</h4>
									<div className="flex items-center gap-1 mt-2">
										{Array.from(
											{ length: item.rating },
											(_, i) => `star-${item.name}-${i}`,
										).map((starKey) => (
											<IoStar
												className="text-yellow-400"
												key={starKey}
												size={18}
											/>
										))}
									</div>
								</div>
							</div>
						</div>
					))}
				</Slider>
			</div>
		</section>
	);
}
