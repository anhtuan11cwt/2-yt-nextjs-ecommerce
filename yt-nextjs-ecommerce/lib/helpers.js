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
