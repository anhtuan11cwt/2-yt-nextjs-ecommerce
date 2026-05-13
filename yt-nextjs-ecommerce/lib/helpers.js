import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export const response = ({ success, statusCode, message, data = null }) => {
	return NextResponse.json(
		{
			data,
			message,
			success,
		},
		{
			status: statusCode,
		},
	);
};

export const generateOTP = () => {
	return Math.floor(100000 + Math.random() * 900000).toString();
};

export const comparePassword = async (password, hashedPassword) => {
	return await bcryptjs.compare(password, hashedPassword);
};
