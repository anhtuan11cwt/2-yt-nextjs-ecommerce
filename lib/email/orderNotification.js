import sendEmail from "@/lib/sendEmail";

const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price);

const statusMap = {
	Cancelled: "Đã hủy",
	Delivered: "Đã giao hàng",
	Pending: "Chờ xử lý",
	Processing: "Đang xử lý",
	Shipped: "Đang giao hàng",
};

const translateStatus = (status) => statusMap[status] || status;

const orderNotification = async ({ order }) => {
	const productsHtml = order.products
		.map(
			(item) => `
      <tr>
        <td style="padding:12px 8px;border-bottom:1px solid #e5e7eb;">
          <div style="font-weight:600;color:#111827;">${item.name}</div>
          ${
						item.color || item.size
							? `<div style="font-size:13px;color:#6b7280;margin-top:4px;">${[item.color, item.size].filter(Boolean).join(" / ")}</div>`
							: ""
					}
        </td>
        <td style="padding:12px 8px;border-bottom:1px solid #e5e7eb;text-align:center;">
          ${item.quantity}
        </td>
        <td style="padding:12px 8px;border-bottom:1px solid #e5e7eb;text-align:right;white-space:nowrap;">
          ${formatPrice(item.price)}₫
        </td>
      </tr>
    `,
		)
		.join("");

	const emailHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #e5e7eb;border-radius:12px;">
      <h2 style="color:#16a34a;margin-bottom:4px;">
        Đặt hàng thành công!
      </h2>
      <p style="color:#6b7280;margin-top:0;">
        Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi.
      </p>

      <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:20px 0;">
        <p style="margin:0 0 8px;"><strong>Mã đơn hàng:</strong> #${order._id}</p>
        <p style="margin:0 0 8px;"><strong>Trạng thái:</strong> ${translateStatus(order.orderStatus)}</p>
        <p style="margin:0;"><strong>Ngày đặt:</strong> ${new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
      </div>

      <h3 style="color:#111827;margin-top:24px;">Chi tiết đơn hàng</h3>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="border-bottom:2px solid #e5e7eb;">
            <th style="padding:12px 8px;text-align:left;font-size:13px;color:#6b7280;">Sản phẩm</th>
            <th style="padding:12px 8px;text-align:center;font-size:13px;color:#6b7280;">SL</th>
            <th style="padding:12px 8px;text-align:right;font-size:13px;color:#6b7280;">Giá</th>
          </tr>
        </thead>
        <tbody>
          ${productsHtml}
        </tbody>
      </table>

      <div style="border-top:2px solid #e5e7eb;margin-top:16px;padding-top:16px;">
        ${
					order.couponDiscount > 0
						? `<div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span style="color:#6b7280;">Mã giảm giá (${order.couponCode})</span>
                <span style="color:#16a34a;">-${formatPrice(order.couponDiscount)}₫</span>
              </div>`
						: ""
				}				
        <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;">
          <span>Tổng cộng: </span>
          <span>${formatPrice(order.totalAmount)}₫</span>
        </div>
      </div>

      ${
				order.shippingAddress
					? `<div style="background:#f9fafb;padding:16px;border-radius:8px;margin-top:20px;">
            <h4 style="margin:0 0 8px;color:#111827;">Địa chỉ giao hàng</h4>
            <p style="margin:0;color:#6b7280;font-size:14px;">
              ${order.shippingAddress.name || ""}<br />
              ${order.shippingAddress.phone || ""}<br />
              ${[order.shippingAddress.landmark, order.shippingAddress.city, order.shippingAddress.state].filter(Boolean).join(", ")}
              ${order.shippingAddress.pincode ? ` - ${order.shippingAddress.pincode}` : ""}
            </p>
          </div>`
					: ""
			}

      <p style="color:#6b7280;font-size:13px;margin-top:24px;">
        Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.
      </p>
    </div>
  `;

	return sendEmail({
		html: emailHtml,
		subject: `Xác nhận đơn hàng #${order._id}`,
		to: order.shippingAddress?.email,
	});
};

export { orderNotification };
