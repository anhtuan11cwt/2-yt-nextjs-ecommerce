const PrivacyPolicyPage = () => {
	return (
		<div className="max-w-4xl mx-auto px-5 my-20">
			<h1 className="text-3xl font-bold border-b pb-4 mb-6">
				Chính sách bảo mật
			</h1>
			<div className="space-y-6 text-gray-600 text-sm leading-7">
				<p className="text-gray-500 italic">Cập nhật lần cuối: Tháng 5, 2026</p>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold">
						1. Thông tin chúng tôi thu thập
					</h2>
					<p>
						Chúng tôi thu thập thông tin bạn cung cấp trực tiếp khi tạo tài
						khoản, cập nhật hồ sơ, thực hiện mua hàng hoặc liên hệ với chúng
						tôi. Thông tin có thể bao gồm tên, email, số điện thoại, địa chỉ
						giao hàng và lịch sử thanh toán.
					</p>
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold">
						2. Cách chúng tôi sử dụng thông tin
					</h2>
					<p>
						Chúng tôi sử dụng dữ liệu thu thập được để xử lý đơn hàng, quản lý
						tài khoản, gửi cập nhật giao dịch và cải thiện chức năng website.
						Thông tin của bạn được bảo vệ trên hệ thống máy chủ an toàn.
					</p>
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold">3. Bảo vệ & An toàn dữ liệu</h2>
					<p>
						Chúng tôi triển khai giám sát bảo mật liên tục để bảo vệ thông tin
						cá nhân của bạn. Chúng tôi không bán, trao đổi hoặc cho thuê thông
						tin cá nhân của bạn cho bên thứ ba.
					</p>
				</section>
			</div>
		</div>
	);
};

export default PrivacyPolicyPage;
