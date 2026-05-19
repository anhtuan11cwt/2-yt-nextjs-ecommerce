"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// Schema validation OTP 6 số
const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP phải có 6 chữ số")
    .max(6, "OTP phải có 6 chữ số")
    .regex(/^\d+$/, "OTP chỉ được chứa số"),
});

// Component xác thực OTP với form input
export default function OtpVerification({ email, onVerifySuccess }) {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      otp: "",
    },
    resolver: zodResolver(otpSchema),
  });

  const otpValue = useWatch({
    control,
    name: "otp",
  });

  // Xác thực OTP
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/verify-otp", {
        email,
        otp: data.otp,
      });
      toast.success("Đăng nhập thành công!");
      onVerifySuccess(response.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Xác thực OTP thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Gửi lại mã OTP
  const handleResendOtp = async () => {
    try {
      setResending(true);
      await axios.post("/api/auth/resend-otp", {
        email,
      });
      toast.success("Đã gửi lại mã OTP");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gửi lại OTP thất bại");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-center">Xác thực OTP</h2>
        <p className="text-sm text-muted-foreground text-center mt-1">
          Nhập mã 6 chữ số đã được gửi đến email của bạn
        </p>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            onChange={(value) => setValue("otp", value)}
            value={otpValue}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        {errors.otp && (
          <p className="text-center text-sm text-red-500">
            {errors.otp.message}
          </p>
        )}
        <Button className="w-full h-11" disabled={loading} type="submit">
          {loading ? "Đang xác thực..." : "Xác thực OTP"}
        </Button>
      </form>
      <div className="text-center">
        <button
          className="text-sm text-violet-600 hover:underline"
          disabled={resending}
          onClick={handleResendOtp}
          type="button"
        >
          {resending ? "Đang gửi lại..." : "Gửi lại OTP"}
        </button>
      </div>
    </div>
  );
}
