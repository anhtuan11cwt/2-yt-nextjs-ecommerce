import Link from "next/link";

import {
	FaFacebookF,
	FaInstagram,
	FaTwitter,
	FaWhatsapp,
	FaYoutube,
} from "react-icons/fa";

import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

const Footer = () => {
	return (
		<footer className="bg-white border-t mt-20">
			{" "}
			<div className="lg:px-8 px-4">
				<div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-10 py-14">
					{/* Column 1 */}
					<div className="space-y-5">
						<Link href="/">
							<span className="text-2xl font-bold">LOGO</span>
						</Link>
						<p className="text-gray-600 leading-7 text-sm">
							Cửa hàng thời trang cao cấp chuyên cung cấp các sản phẩm
							streetwear, áo thun, hoodies và thời trang hiện đại cho phong cách
							sống hằng ngày.
						</p>
					</div>

					{/* Column 2 */}
					<div>
						<h2 className="text-lg font-semibold mb-5 uppercase">Danh mục</h2>
						<ul className="space-y-3">
							{[
								{ name: "Áo thun", slug: "t-shirts" },
								{ name: "Hoodies", slug: "hoodies" },
								{ name: "Áo tay dài", slug: "full-sleeves" },
								{ name: "Áo Polo", slug: "polo" },
								{ name: "Áo Oversized", slug: "oversized" },
							].map((item) => (
								<li key={item.slug}>
									<Link
										className="text-gray-600 hover:text-primary transition-all duration-300"
										href={`/website/shop?category=${item.slug}`}
									>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Column 3 */}
					<div>
						<h2 className="text-lg font-semibold mb-5 uppercase">
							Liên kết hữu ích
						</h2>
						<ul className="space-y-3">
							{[
								{ href: "/website", name: "Trang chủ" },
								{ href: "/website/shop", name: "Cửa hàng" },
								{ href: "/website/about-us", name: "Về chúng tôi" },
								{ href: "/register", name: "Đăng ký" },
								{ href: "/login", name: "Đăng nhập" },
							].map((link) => (
								<li key={link.name}>
									<Link
										className="text-gray-600 hover:text-primary transition-all duration-300"
										href={link.href}
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Column 4 */}
					<div>
						<h2 className="text-lg font-semibold mb-5 uppercase">Hỗ trợ</h2>
						<ul className="space-y-3">
							{[
								{ href: "/website/user/dashboard", name: "Tài khoản của tôi" },
								{ href: "/website/privacy-policy", name: "Chính sách bảo mật" },
								{
									href: "/website/terms-and-conditions",
									name: "Điều khoản & Điều kiện",
								},
							].map((link) => (
								<li key={link.name}>
									<Link
										className="text-gray-600 hover:text-primary transition-all duration-300"
										href={link.href}
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Column 5 */}
					<div>
						<h2 className="text-lg font-semibold mb-5 uppercase">Liên hệ</h2>
						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<MdLocationOn className="text-primary mt-1" size={22} />
								<p className="text-gray-600 text-sm leading-6">
									TP. Hồ Chí Minh, Việt Nam
								</p>
							</div>
							<div className="flex items-center gap-3">
								<MdPhone className="text-primary" size={20} />
								<p className="text-gray-600 text-sm">+84 123 456 789</p>
							</div>
							<div className="flex items-center gap-3">
								<MdEmail className="text-primary" size={20} />
								<p className="text-gray-600 text-sm">
									support@fashionstore.com
								</p>
							</div>
						</div>

						{/* Social Icons */}
						<div className="flex items-center gap-3 mt-6">
							{[
								{ Icon: FaYoutube, key: "youtube" },
								{ Icon: FaInstagram, key: "instagram" },
								{ Icon: FaFacebookF, key: "facebook" },
								{ Icon: FaTwitter, key: "twitter" },
								{ Icon: FaWhatsapp, key: "whatsapp" },
							].map(({ Icon, key }) => (
								<Link
									className="w-10 h-10 rounded-full border flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
									href="/"
									key={key}
								>
									<Icon size={18} />
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
			{/* Copyright */}
			<div className="border-t bg-gray-100">
				<div className="lg:px-8 px-4 py-5 flex lg:flex-row flex-col items-center justify-between gap-3">
					<p className="text-sm text-gray-600 text-center">
						© {new Date().getFullYear()} Fashion Store. Bảo lưu mọi quyền.
					</p>
					<p className="text-sm text-gray-600 text-center">
						Thiết kế & Phát triển với Next.js 16
					</p>{" "}
				</div>
			</div>
		</footer>
	);
};

export default Footer;
