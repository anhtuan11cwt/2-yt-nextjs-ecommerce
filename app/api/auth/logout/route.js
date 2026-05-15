import { cookies } from "next/headers";
import connectDB from "@/lib/dbConnection";

// API đăng xuất: xóa cookie access_token
export async function POST() {
	try {
		await connectDB();
		const cookieStore = await cookies();
		cookieStore.delete("access_token");
		return Response.json({
			message: "Đăng xuất thành công",
			success: true,
		});
	} catch (error) {
		return Response.json(
			{
				message: error.message || "Đăng xuất thất bại",
				success: false,
			},
			{ status: 500 },
		);
	}
}
