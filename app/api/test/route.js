import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnection";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		await connectDB();
		return NextResponse.json({
			message: "Kết nối thành công",
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{
				error: error.message,
				success: false,
			},
			{ status: 500 },
		);
	}
}
