const otpEmail = (otp) => {
	return `
    <div
      style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 20px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
      "
    >
<h2 style="color:#7c3aed;">
        Xác minh đăng nhập
      </h2>

      <p>
        Sử dụng mã OTP dưới đây để hoàn tất đăng nhập.
      </p>

      <p>
        Mã OTP sẽ hết hạn sau
        <strong>10 phút</strong>.
      </p>

      <p style="color:#6b7280;">
        Nếu bạn không yêu cầu đăng nhập này,
        vui lòng bỏ qua email này.
      </p>

      <div
        style="
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 8px;
          text-align: center;
          margin: 30px 0;
          color:#111827;
        "
      >
        ${otp}
      </div>

      <p>
        This OTP will expire in
        <strong>10 minutes</strong>.
      </p>

      <p style="color:#6b7280;">
        If you did not request this login,
        please ignore this email.
      </p>
    </div>
  `;
};

export default otpEmail;
