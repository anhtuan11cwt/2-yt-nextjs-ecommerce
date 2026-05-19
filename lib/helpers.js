import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

// Tạo response chuẩn cho API
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

// Sinh mã OTP 6 số ngẫu nhiên
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// So sánh mật khẩu với hash
export const comparePassword = async (password, hashedPassword) => {
  return await bcryptjs.compare(password, hashedPassword);
};
