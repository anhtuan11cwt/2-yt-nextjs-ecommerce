import { NextResponse } from "next/server";
import { isAuthenticated } from "@/helpers/is-authenticated";
import connectMongoDB from "@/lib/dbConnection";
import User from "@/models/User.model";

// API danh sách khách hàng (role: user)
export async function GET(request) {
	try {
		await connectMongoDB();
		await isAuthenticated("admin");

		const { searchParams } = new URL(request.url);

		const page = Number.parseInt(searchParams.get("page") || "1", 10);
		const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
		const globalFilter = searchParams.get("globalFilter") || "";
		const deleteType = searchParams.get("deleteType") || "SD";

		const matchStage = { role: "user" };

		if (deleteType === "SD") {
			matchStage.deletedAt = null;
		} else {
			matchStage.deletedAt = { $ne: null };
		}

		if (globalFilter) {
			const regex = new RegExp(globalFilter, "i");
			matchStage.$or = [{ name: regex }, { email: regex }, { phone: regex }];
		}

		const [customers, total] = await Promise.all([
			User.find(matchStage)
				.select("-password")
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit),
			User.countDocuments(matchStage),
		]);

		return NextResponse.json({
			data: customers,
			success: true,
			total,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: error.message, success: false },
			{ status: 500 },
		);
	}
}
