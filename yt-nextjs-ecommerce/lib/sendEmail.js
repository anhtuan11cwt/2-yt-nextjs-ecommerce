import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	auth: {
		pass: process.env.SMTP_PASSWORD,
		user: process.env.SMTP_EMAIL,
	},
	service: "gmail",
});

const sendEmail = async ({ to, subject, html }) => {
	return await transporter.sendMail({
		from: process.env.SMTP_EMAIL,
		html,
		subject,
		to,
	});
};

export default sendEmail;
