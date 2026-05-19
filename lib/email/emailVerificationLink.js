// HTML template email xác thực
const emailVerificationLink = ({ name, verificationUrl }) => {
  return `
    <div style="max-width:600px;margin:auto;padding:40px;background:#ffffff;font-family:Arial;">
      <h1 style="color:#7c3aed;margin-bottom:20px;">Xác Thực Email Của Bạn</h1>
      <p>Xin chào ${name},</p>
      <p>Cảm ơn bạn đã đăng ký.</p>
      <p>Nhấp vào nút bên dưới để xác thực địa chỉ email của bạn.</p>
      <a href="${verificationUrl}" style="display:inline-block;padding:14px 24px;background:#7c3aed;color:white;text-decoration:none;border-radius:8px;margin-top:20px;">Xác Thực Email</a>
      <p style="margin-top:30px;color:#777;font-size:14px;">Liên kết này sẽ hết hạn sau 1 giờ.</p>
    </div>
  `;
};

export default emailVerificationLink;
