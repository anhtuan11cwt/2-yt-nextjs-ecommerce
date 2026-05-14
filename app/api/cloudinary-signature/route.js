import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request) {
	try {
		const body = await request.json();
		const paramsToSign = body?.paramsToSign;

		const signature = cloudinary.utils.api_sign_request(
			paramsToSign,
			process.env.CLOUDINARY_API_SECRET,
		);

		return NextResponse.json({
			signature,
		});
	} catch (error) {
		return NextResponse.json(
			{
				message: error.message,
				success: false,
			},
			{
				status: 500,
			},
		);
	}
}
