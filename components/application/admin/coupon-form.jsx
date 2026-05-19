"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Form tạo/chỉnh sửa mã giảm giá
export default function CouponForm({ initialData = {}, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    code: initialData.code || "",
    discountPercent: initialData.discountPercent || "",
    minimumShoppingAmount: initialData.minimumShoppingAmount || "",
    validity: initialData.validity ? new Date(initialData.validity) : null,
  });

  // Cập nhật state controlled cho các input text/number
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form
      className="space-y-5 bg-white border rounded-2xl p-6"
      onSubmit={(e) => onSubmit(e, formData)}
    >
      <div className="space-y-2">
        <Label>Mã giảm giá</Label>
        <Input
          disabled={loading}
          name="code"
          onChange={handleChange}
          placeholder="VD: SUMMER50"
          value={formData.code}
        />
      </div>

      <div className="space-y-2">
        <Label>Phần trăm giảm giá</Label>
        <Input
          disabled={loading}
          name="discountPercent"
          onChange={handleChange}
          placeholder="10"
          type="number"
          value={formData.discountPercent}
        />
      </div>

      <div className="space-y-2">
        <Label>Số tiền mua tối thiểu</Label>
        <Input
          disabled={loading}
          name="minimumShoppingAmount"
          onChange={handleChange}
          placeholder="500"
          type="number"
          value={formData.minimumShoppingAmount}
        />
      </div>

      <div className="space-y-2">
        <Label>Validity</Label>
        <DatePicker
          className="w-full border rounded-md px-3 py-2"
          dateFormat="dd/MM/yyyy hh:mm aa"
          disabled={loading}
          onChange={(date) =>
            setFormData((prev) => ({
              ...prev,
              validity: date,
            }))
          }
          placeholderText="Chọn ngày hết hạn"
          selected={formData.validity}
          showTimeSelect
        />
      </div>

      <Button className="w-full" disabled={loading} type="submit">
        {loading ? "Đang xử lý..." : "Lưu mã giảm giá"}
      </Button>
    </form>
  );
}
