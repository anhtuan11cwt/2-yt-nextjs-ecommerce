import nodemailer from "nodemailer";

// Cấu hình Gmail transporter
const transporter = nodemailer.createTransport({
  auth: {
    pass: process.env.SMTP_PASSWORD,
    user: process.env.SMTP_EMAIL,
  },
  service: "gmail",
});

// Gửi email qua Gmail SMTP
const sendEmail = async ({ to, subject, html }) => {
  return await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    html,
    subject,
    to,
  });
};

export default sendEmail;
