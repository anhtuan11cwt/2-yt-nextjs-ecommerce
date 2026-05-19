"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { FiEye, FiEyeOff } from "react-icons/fi";
import ButtonLoading from "@/components/application/ButtonLoading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { registerSchema } from "@/lib/zodSchema";
import WEBSITE_ROUTES from "@/routes/website.routes";

// Trang đăng ký tài khoản mới
export default function RegisterPage() {
  const [isTypePassword, setIsTypePassword] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(registerSchema),
  });

  // Gửi yêu cầu đăng ký và gửi email xác thực
  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/auth/register", data);
      toast.success(
        response.data.message ||
          "Đăng ký thành công! Vui lòng kiểm tra email để xác thực.",
      );
      reset();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
      );
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex justify-center">
          <Image alt="logo" height={70} src="/vercel.svg" width={70} />
        </div>

        <div className="text-center">
          <CardTitle className="text-2xl">Tạo Tài Khoản</CardTitle>

          <CardDescription>Đăng ký tài khoản mới của bạn</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="font-medium text-sm" htmlFor="name">
              Tên
            </label>

            <input
              className="mt-2 px-4 border rounded-md w-full h-11 disabled:opacity-50"
              disabled={isSubmitting}
              id="name"
              placeholder="Nhập tên của bạn"
              type="text"
              {...register("name")}
            />

            {errors.name && (
              <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="font-medium text-sm" htmlFor="email">
              Email
            </label>

            <input
              className="mt-2 px-4 border rounded-md w-full h-11 disabled:opacity-50"
              disabled={isSubmitting}
              id="email"
              placeholder="Nhập email của bạn"
              type="email"
              {...register("email")}
            />

            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="font-medium text-sm" htmlFor="password">
              Mật khẩu
            </label>

            <div className="relative mt-2">
              <input
                className="px-4 pr-12 border rounded-md w-full h-11 disabled:opacity-50"
                disabled={isSubmitting}
                id="password"
                placeholder="Nhập mật khẩu"
                type={isTypePassword ? "password" : "text"}
                {...register("password")}
              />

              <button
                className="top-1/2 right-4 absolute -translate-y-1/2 disabled:opacity-50"
                disabled={isSubmitting}
                onClick={() => setIsTypePassword(!isTypePassword)}
                type="button"
              >
                {isTypePassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="font-medium text-sm" htmlFor="confirmPassword">
              Xác nhận mật khẩu
            </label>

            <div className="relative mt-2">
              <input
                className="px-4 pr-12 border rounded-md w-full h-11 disabled:opacity-50"
                disabled={isSubmitting}
                id="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                type={isTypePassword ? "password" : "text"}
                {...register("confirmPassword")}
              />

              <button
                className="top-1/2 right-4 absolute -translate-y-1/2 disabled:opacity-50"
                disabled={isSubmitting}
                onClick={() => setIsTypePassword(!isTypePassword)}
                type="button"
              >
                {isTypePassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <ButtonLoading
            loading={isSubmitting}
            text="Tạo Tài Khoản"
            type="submit"
          />

          <div className="text-sm text-center">
            Bạn đã có tài khoản?{" "}
            <Link
              className={`font-medium text-primary ${isSubmitting ? "pointer-events-none opacity-50" : ""}`}
              href={WEBSITE_ROUTES.LOGIN}
            >
              Đăng nhập
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
