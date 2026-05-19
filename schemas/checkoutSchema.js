import { z } from "zod";

export const checkoutSchema = z.object({
  city: z.string().min(2, "Vui lòng nhập quận/huyện"),
  email: z.string().email("Email không hợp lệ"),
  landmark: z.string().optional(),
  name: z.string().min(3, "Vui lòng nhập tên đầy đủ"),
  orderNote: z.string().optional(),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  pincode: z.string().min(4, "Mã bưu điện không hợp lệ"),
  state: z.string().min(2, "Vui lòng nhập tỉnh/thành phố"),
});
