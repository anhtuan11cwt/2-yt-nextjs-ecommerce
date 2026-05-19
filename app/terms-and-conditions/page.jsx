const TermsAndConditionsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-5 my-20">
      <h1 className="text-3xl font-bold border-b pb-4 mb-6">
        Điều khoản & Điều kiện
      </h1>
      <div className="space-y-6 text-gray-600 text-sm leading-7">
        <p className="text-gray-500 italic">Cập nhật lần cuối: Tháng 5, 2026</p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. Thỏa thuận sử dụng</h2>
          <p>
            Bằng cách truy cập và đặt hàng trên nền tảng của chúng tôi, bạn xác
            nhận rằng bạn đồng ý và bị ràng buộc bởi các điều khoản dịch vụ được
            nêu trong tài liệu này.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">2. Sản phẩm & Hàng tồn kho</h2>
          <p>
            Chúng tôi cố gắng hiển thị chính xác các biến thể sản phẩm, kích
            thước, màu sắc và hình ảnh. Tuy nhiên, màu sắc hiển thị thực tế phụ
            thuộc vào thiết bị của bạn. Giá sản phẩm và mã khuyến mãi có thể
            thay đổi mà không cần thông báo trước.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">3. Hủy đơn & Hoàn tiền</h2>
          <p>
            Chúng tôi có quyền từ chối hoặc hủy bất kỳ đơn hàng nào nếu phát
            hiện sản phẩm hết hàng hoặc gian lận thanh toán. Nếu giao dịch của
            bạn đã được xử lý thành công trước khi hủy, hoàn tiền sẽ được khởi
            tạo tự động.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
