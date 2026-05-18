# yt-nextjs-ecommerce - Ứng Dụng E-commerce Full-Stack Với Next.js 16

Dự án xây dựng một nền tảng thương mại điện tử đầy đủ tính năng sử dụng Next.js 16 (App Router), MongoDB, và các công nghệ hiện đại. Dự án bao gồm hệ thống quản trị admin toàn diện và trải nghiệm người dùng mượt mà.

## Tính Năng Chính

### Frontend (Người Dùng)

- **Trang chủ** với slider, banner quảng cáo, sản phẩm nổi bật, đánh giá khách hàng
- **Trang Shop** với bộ lọc nâng cao (danh mục, màu, kích thước, giá), sắp xếp và tìm kiếm
- **Trang chi tiết sản phẩm** với gallery ảnh, chọn biến thể (màu/size), mô tả Rich Text (CKEditor), đánh giá sản phẩm
- **Giỏ hàng** cập nhật realtime, đồng bộ server/client, hỗ trợ thay đổi số lượng và xóa sản phẩm
- **Thanh toán** tích hợp Stripe Checkout (VND) với hỗ trợ coupon giảm giá
- **Hệ thống xác thực** đầy đủ: đăng ký, đăng nhập (user qua OTP 2FA, admin trực tiếp), xác thực email qua link, quên mật khẩu
- **Trang cá nhân người dùng** với lịch sử đơn hàng, cập nhật hồ sơ
- **Tìm kiếm sản phẩm** client-side với Fuse.js
- **Responsive hoàn toàn** trên mọi thiết bị

### Admin Dashboard

- **Bảng điều khiển tổng quan** với biểu đồ doanh thu theo tháng, trạng thái đơn hàng, đơn hàng và đánh giá mới nhất (Recharts)
- **Quản lý Sản phẩm** CRUD đầy đủ, soft delete/restore, mô tả Rich Text với CKEditor
- **Quản lý Biến thể** (màu sắc, kích thước) cho từng sản phẩm
- **Quản lý Danh mục** CRUD
- **Quản lý Mã giảm giá** với điều kiện sử dụng và thời hạn
- **Quản lý Đơn hàng** xem chi tiết, cập nhật trạng thái (Pending, Processing, Shipped, Delivered, Cancelled)
- **Quản lý Khách hàng** và đánh giá sản phẩm
- **Thư viện Media** upload và quản lý ảnh qua Cloudinary
- **DataTable nâng cao** (Material React Table) với tìm kiếm inline, lọc cột, sắp xếp, chọn nhiều hàng, xuất CSV
- **Tìm kiếm toàn cục** trong Admin với modal search
- **Chủ đề tối/sáng** tùy chọn
- **Responsive hoàn toàn** trên mobile và tablet

## Công Nghệ Sử Dụng

### Framework & Thư Viện Chính

- **[Next.js 16](https://nextjs.org)** (App Router) - Framework Full-Stack
- **[React 19](https://react.dev)** - Thư viện UI
- **[Tailwind CSS v4](https://tailwindcss.com)** - Framework CSS
- **[shadcn/ui](https://ui.shadcn.com)** - Thư viện component
- **[Lucide React](https://lucide.dev)** + **[React Icons](https://react-icons.github.io/react-icons/)** - Bộ icon
- **[Framer Motion](https://www.framer.com/motion/)** - Animation

### State Management & Data Fetching

- **[Redux Toolkit](https://redux-toolkit.js.org)** + **[Redux Persist](https://github.com/rt2zz/redux-persist)** - Quản lý global state (giỏ hàng, auth)
- **[TanStack Query (React Query)](https://tanstack.com/query/v5)** - Server state management
- **[SWR](https://swr.vercel.app)** - Data fetching
- **[Axios](https://axios-http.com)** - HTTP client
- **[Zod](https://zod.dev)** - Schema validation (client & server)

### Backend & Cơ Sở Dữ Liệu

- **[Mongoose](https://mongoosejs.com)** + **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** - ODM & Database
- **[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)** / **[jose](https://github.com/panva/jose)** - Xác thực JWT
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Mã hóa mật khẩu
- **[Nodemailer](https://nodemailer.com/about/)** - Gửi email xác thực & OTP qua Gmail SMTP
- **[Cloudinary](https://cloudinary.com)** + **[next-cloudinary](https://next-cloudinary.vercel.app)** - Lưu trữ & xử lý ảnh

### Thanh Toán

- **[Stripe](https://stripe.com)** + **[@stripe/stripe-js](https://github.com/stripe/stripe-js)** - Cổng thanh toán (Stripe Checkout, VND)

### UI/UX & Các Tiện Ích

- **[CKEditor 5](https://ckeditor.com/ckeditor-5/)** - Rich text editor cho mô tả sản phẩm
- **[Recharts](https://recharts.org)** - Biểu đồ trong Dashboard
- **[Fuse.js](https://fusejs.io)** - Tìm kiếm client-side
- **[Material React Table](https://material-react-table.com)** - Bảng dữ liệu Admin nâng cao
- **[MUI](https://mui.com)** - Material UI components (date pickers, icons)
- **[React Hook Form](https://react-hook-form.com)** + **[Zod](https://zod.dev)** - Xác thực form
- **[Radix UI](https://www.radix-ui.com)** - Component primitive (Accordion, Slider, Dialog, etc.)
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Quản lý dark/light mode
- **[dayjs](https://day.js.org)** - Xử lý thời gian
- **[react-slick](https://react-slick.neostack.com)** - Slider/carousel
- **[react-dropzone](https://react-dropzone.js.org)** - Upload file kéo thả
- **[react-datepicker](https://reactdatepicker.com)** - Date picker
- **[input-otp](https://github.com/guilhermerodz/input-otp)** - OTP input component
- **[sonner](https://sonner.emilkowal.ski)** + **[React Hot Toast](https://react-hot-toast.com)** - Thông báo
- **[slugify](https://www.npmjs.com/package/slugify)** - Tạo slug tự động
- **[he](https://www.npmjs.com/package/he)** - Mã hóa HTML entities
- **[sanitize-html](https://www.npmjs.com/package/sanitize-html)** - Làm sạch HTML
- **[export-to-csv](https://www.npmjs.com/package/export-to-csv)** - Xuất dữ liệu CSV

### DevTools & Quality

- **[ESLint](https://eslint.org)** + **[Biome](https://biomejs.dev)** - Linting & formatting
- **[React Query Devtools](https://tanstack.com/query/v5/docs/react/devtools)** - Monitoring queries

## Bắt Đầu

### Điều Kiện Tiên Quyết

- Node.js >= 18.x
- MongoDB Atlas account (hoặc MongoDB local)
- Cloudinary account (cho upload ảnh)
- Tài khoản Gmail với App Password (để gửi email xác thực/OTP)
- Tài khoản Stripe (test mode)
- License key CKEditor 5 (dùng `GPL` cho open source)

### Các Bước Cài Đặt

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd yt-nextjs-ecommerce
   ```

2. **Cài đặt dependencies**

   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường**

   Tạo file `.env.local` tại thư mục gốc dựa trên `.env.example`:

   ```env
   # MongoDB
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/yt-nextjs-ecommerce?retryWrites=true&w=majority

   # Auth
   JWT_SECRET=your_jwt_secret_key

   # Email (Gmail SMTP)
   SMTP_EMAIL=your_gmail@gmail.com
   SMTP_PASSWORD=your_gmail_app_password

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

   # App URLs
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:3000

   # CKEditor
   NEXT_PUBLIC_CKEDITOR_LICENSE_KEY=GPL

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   ```

4. **Seed dữ liệu admin mẫu**

   ```bash
   npm run seed:admin
   ```

   Tài khoản admin mặc định:
   - Email: `admin@gmail.com`
   - Mật khẩu: `admin@2525`
   - OTP mặc định: `123456` (cho dev)

5. **Chạy development server**

   ```bash
   npm run dev
   ```

   Lưu ý: `npm run dev` tự động chạy seed admin script trước khi khởi động server.

6. **Mở trình duyệt**

   Truy cập [http://localhost:3000](http://localhost:3000)

## Tài Khoản Demo

### Admin

Đăng nhập trực tiếp bằng email/mật khẩu, không cần OTP.

- **Email:** `admin@gmail.com`
- **Mật khẩu:** `admin@2525`

### User

Đăng ký tài khoản mới qua trang `/register`, xác thực email qua link, sau đó đăng nhập sẽ nhận OTP qua email.

## Cấu Trúc Dự Án

```text
yt-nextjs-ecommerce/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Xác thực
│   │   ├── login/
│   │   ├── register/
│   │   ├── reset-password/
│   │   └── verify-email/[token]/
│   ├── (root)/
│   │   ├── admin/(admin)/            # Admin dashboard
│   │   │   ├── dashboard/
│   │   │   ├── category/             # add, edit/[id], show
│   │   │   ├── coupons/              # add, edit/[id], show
│   │   │   ├── customers/
│   │   │   ├── media/                # edit/[id]
│   │   │   ├── orders/               # [orderId]/details
│   │   │   └── product/              # add, edit/[id], show, variants/...
│   │   └── my-account/
│   ├── about-us/
│   ├── cart/
│   ├── checkout/
│   ├── order/                        # success page (Stripe redirect)
│   ├── order-details/
│   ├── privacy-policy/
│   ├── product/
│   ├── shop/
│   ├── terms-and-conditions/
│   └── user/
│   ├── api/                          # API Routes
│   │   ├── admin/                    # dashboard stats, orders
│   │   ├── auth/                     # login, logout, register, verify-email, verify-otp, reset-password, resend-otp
│   │   ├── cart/                     # sync, clear, verification
│   │   ├── category/                 # CRUD
│   │   ├── cloudinary-signature/
│   │   ├── coupon/                   # apply, CRUD
│   │   ├── customer/
│   │   ├── media/                    # CRUD
│   │   ├── order/                    # confirm, get/[orderId], update-status
│   │   ├── payment/
│   │   │   └── create-checkout-session/  # Stripe Checkout
│   │   ├── product/                  # CRUD, soft delete/restore, shop, featured
│   │   ├── product-variant/          # CRUD, colors, sizes
│   │   ├── profile/
│   │   ├── review/
│   │   └── user-orders/
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
├── components/
│   ├── application/
│   │   ├── admin/                    # AppSidebar, Topbar, DataTable, charts, forms, media, search
│   │   └── website/                  # Header, Footer, website-specific components
│   ├── providers/
│   │   └── GlobalProvider
│   ├── ui/                           # shadcn/ui components
│   └── website/                      # MainSlider, ProductBox, Cart, Checkout, Shop, etc.
├── lib/
│   ├── api/
│   ├── email/                        # emailVerificationLink, otpEmail, orderNotification
│   ├── redux/
│   ├── adminSidebarMenu.js
│   ├── cloudinary.js
│   ├── dbConnection.js
│   ├── helpers.js
│   ├── search.js                     # Fuse.js search logic
│   ├── sendEmail.js
│   ├── stripe.js                     # Stripe SDK init
│   ├── utils.js
│   └── zodSchema.js
├── models/
│   ├── cart.model.js
│   ├── category.model.js
│   ├── coupon.model.js
│   ├── media.model.js
│   ├── order.model.js
│   ├── OTP.model.js
│   ├── product.model.js
│   ├── productVariant.model.js
│   ├── review.model.js
│   └── User.model.js
├── public/
│   └── assets/images/
├── scripts/
│   └── seed-admin.mjs
├── .env.example
├── .gitignore
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
└── README.md
```

## Chạy Kiểm Tra & Lint

```bash
# Chạy ESLint
npm run lint

# Chạy Biome format + organize imports
npm run check

# Chạy Biome check với unsafe fixes (tự động sửa lỗi)
npm run check2

# Chạy Biome format only
npm run format
```

## Triển Khai

### Vercel (Khuyến Nghị)

1. Đẩy code lên GitHub
2. Import project từ GitHub vào Vercel
3. Thêm tất cả biến môi trường từ `.env.local` vào cài đặt Vercel → Environment Variables
4. Vercel sẽ tự động build và triển khai

### Thủ Công

```bash
npm run build
npm start
```

## Quy Trình Phát Triển

- Mỗi tính năng mới nên được phát triển trên nhánh feature riêng
- Tuân thủ quy ước code style hiện tại (không có bình luận thừa, functions ngắn gọn)
- Luôn chạy `npm run check2` và `npm run lint` trước khi commit
- Viết commit message rõ ràng, mô tả mục đích thay đổi
- Pull request phải được review trước khi merge

## Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng:

1. Fork repository
2. Tạo nhánh feature (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi (`git commit -m 'Add some amazing feature'`)
4. Push lên nhánh (`git push origin feature/amazing-feature`)
5. Mở Pull Request

## Giấy Quyền

Dự án này là phần mềm mã nguồn mở cấp phép dưới [MIT License](LICENSE).

## Cảm ơn

Cảm ơn tất cả các nguồn mở và cộng đồng đã giúp đỡ trong quá trình xây dựng dự án này.

---

*Built with Next.js 16, React 19, and modern web technologies.*
