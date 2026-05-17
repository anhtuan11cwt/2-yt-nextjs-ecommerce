# Sinh Dữ Liệu Giả Bằng Faker.js

## Giới Thiệu

Endpoint cho phép tự động sinh dữ liệu mẫu (products, variants) bằng thư viện Faker.js để phục vụ kiểm thử giao diện, pagination, filter, search và dashboard analytics.

## Endpoint

| Method | URL                     |
| ------ | ----------------------- |
| POST   | `/api/faker/product`    |

Không cần request body.

## Yêu Cầu Trước Khi Chạy

- Database đã có **categories** (tạo qua admin panel)
- Đã upload **media** (hình ảnh) qua trang `/admin/media`

## Cách Dùng

### Thunder Client / Postman

Tạo request POST đến `http://localhost:3000/api/faker/product`, không gửi kèm body.

### Curl (PowerShell)

```powershell
curl.exe -Method POST http://localhost:3000/api/faker/product
```

## Response Thành Công

```json
{
  "success": true,
  "message": "Đã tạo sản phẩm giả thành công",
  "stats": {
    "categories": 5,
    "products": 25,
    "variants": 500
  }
}
```

## Dữ Liệu Được Tạo

| Bảng              | Số lượng | Mô tả                              |
| ----------------- | -------- | ---------------------------------- |
| Categories        | có sẵn   | Lấy từ DB, không tạo mới           |
| Products          | 5/category | 5 sản phẩm / category              |
| Product Variants  | 100/product | 20 variants / product (4 màu × 5 size) |

## Mỗi Product Gồm

- `name` — tên sản phẩm ngẫu nhiên
- `slug` — unique (có random suffix)
- `category` — ObjectId tham chiếu category
- `mrp` — giá gốc (100,000–2,000,000 VNĐ)
- `sellingPrice` — giá bán sau giảm
- `discountPercent` — % giảm (5–60%)
- `description` — mô tả ngẫu nhiên
- `media` — 4 ObjectId ảnh ngẫu nhiên từ thư viện

## Mỗi Variant Gồm

- `product` — ObjectId tham chiếu product cha
- `color` — Đen / Trắng / Xanh dương / Đỏ
- `size` — S / M / L / XL / XXL
- `sku` — mã ngẫu nhiên 10 ký tự (tự động uppercase)
- `mrp`, `sellingPrice`, `discountPercent` — kế thừa từ product
- `media` — kế thừa từ product

## Lưu Ý

- Dùng `insertMany()` để bulk insert, không trigger middleware `pre('save')`.
- `discountPercent` được set thủ công (không auto-calculate).
- Slug product có random suffix 6 ký tự để tránh lỗi unique.
- Có thể gọi lại nhiều lần — mỗi lần tạo thêm batch mới.
