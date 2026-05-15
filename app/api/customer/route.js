import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectMongoDB from "@/lib/dbConnection";
import User from "@/models/User.model";

export async function GET() {
	try {
		await connectMongoDB();
		await isAuthenticated("admin");

		const customers = await User.find({
			deletedAt: null,
			role: "user",
		})
			.select("-password")
			.sort({ createdAt: -1 });

		return NextResponse.json({
			data: customers,
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, success: false },
			{ status: 500 },
		);
	}
}
