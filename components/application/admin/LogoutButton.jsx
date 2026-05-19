"use client";
import axios from "axios";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { logout } from "@/store/reducers/authReducer";

// Nút đăng xuất
const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Gọi API logout và dispatch Redux action
  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/auth/logout");
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      dispatch(logout());
      toast.success("Đăng xuất thành công");
      router.push("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Đã xảy ra lỗi gì đó",
      );
    }
  };

  return (
    <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
      <LogOut className="text-red-500 w-4 h-4 mr-2" />
      Đăng xuất
    </DropdownMenuItem>
  );
};

export default LogoutButton;
