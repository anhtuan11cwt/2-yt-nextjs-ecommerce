"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { User } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import ButtonLoading from "@/components/application/ButtonLoading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import WebsiteBreadcrumb from "@/components/website/WebsiteBreadcrumb";
import useFetch from "@/hooks/useFetch";
import { login } from "@/redux/features/authSlice";

// Schema xác thực form
const profileSchema = z.object({
  address: z.string().min(1, "Địa chỉ là bắt buộc"),
  name: z.string().min(1, "Tên là bắt buộc"),
  phone: z.string().min(1, "Số điện thoại là bắt buộc"),
});

// Trang Hồ sơ của User
export default function UserProfilePage() {
  const breadcrumbLinks = [{ label: "Hồ sơ" }];
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const dispatch = useDispatch();
  const authStore = useSelector((store) => store.auth);
  const { data: profileData } = useFetch({ url: "/api/profile" });

  const form = useForm({
    defaultValues: {
      address: "",
      name: "",
      phone: "",
    },
    resolver: zodResolver(profileSchema),
  });

  // Ảnh avatar: ưu tiên preview mới, sau đó đến avatar từ API
  const avatarUrl = preview || profileData?.data?.avatar?.url || null;

  // Đổ dữ liệu profile vào form khi có data
  useEffect(() => {
    if (profileData?.data) {
      form.reset({
        address: profileData.data.address || "",
        name: profileData.data.name || "",
        phone: profileData.data.phone || "",
      });
    }
  }, [profileData, form]);

  // Xử lý chọn file avatar
  const handleFileSelection = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }, []);

  const { getInputProps, getRootProps } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxSize: 2 * 1024 * 1024,
    multiple: false,
    onDrop: handleFileSelection,
  });

  // Xử lý submit form
  const updateProfileValues = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      if (file) {
        formData.append("file", file);
      }
      formData.append("name", values.name);
      formData.append("phone", values.phone);
      formData.append("address", values.address);

      const response = await axios.put("/api/profile/update", formData);

      if (response.data.success) {
        toast.success(response.data.message || "Cập nhật hồ sơ thành công");
        dispatch(login({ token: authStore.token, user: response.data.data }));
        setFile(null);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Đã xảy ra lỗi gì đó");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <WebsiteBreadcrumb links={breadcrumbLinks} />

      <div className="shadow rounded p-5">
        <h2 className="text-xl font-semibold border-b pb-3 mb-5">
          Thông tin hồ sơ
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(updateProfileValues)}>
            {/* Avatar upload */}
            <div className="flex justify-center mb-6">
              <div
                {...getRootProps()}
                className="relative w-28 h-28 rounded-full border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden group"
              >
                <input {...getInputProps()} />

                {avatarUrl ? (
                  <Image
                    alt="avatar-preview"
                    className="object-cover"
                    fill
                    sizes="112px"
                    src={avatarUrl}
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <User className="text-white w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
              {/* Tên */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ và tên" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Số điện thoại */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Địa chỉ — full width */}
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập địa chỉ giao hàng"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <ButtonLoading
                className="cursor-pointer"
                loading={loading}
                text="Lưu thay đổi"
                type="submit"
              />
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
