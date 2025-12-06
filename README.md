# QuocBank — Ứng dụng ngân hàng mẫu (demo sinh viên)

QuocBank là một dự án demo học tập xây dựng bằng Next.js, Prisma và React. Mục tiêu: minh hoạ các chức năng cơ bản của ngân hàng (đăng ký/đăng nhập, tạo tài khoản, chuyển khoản, lịch sử giao dịch). Đây là trang do sinh viên tạo — **không dùng cho production**.

## Quick Start

1. Cài phụ thuộc:

```bash
npm install
```

2. Tạo file biến môi trường `.env` ở gốc repo với tối thiểu các biến sau:

```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=some_long_random_secret
```

3. Sinh Prisma Client và migrate (nếu cần):

```bash
npx prisma generate
# nếu muốn chạy migration dev
npx prisma migrate dev --name init
```

4. Chạy dev server:

```bash
npm run dev
```

5. Mở `http://localhost:3000` để xem ứng dụng.

## Lệnh build & chạy production

```bash
npm run build
npm start
```

## Ghi chú phát triển

- Trước khi chạy, đảm bảo `.env` đã cấu hình đúng.
- Nếu bạn thay đổi `prisma/schema.prisma`, chạy `npx prisma generate` và (nếu cần) `npx prisma migrate dev`.
- Project sử dụng Next.js App Router và Server Actions cho một số API nội bộ; một vài route quan trọng:
  - `GET /api/accounts/list` — danh sách tài khoản của user
  - `POST /api/transactions/transfer` — thực hiện chuyển khoản
  - `GET /api/accounts/search` — tìm tài khoản theo số hoặc tên
  - `POST /api/auth/logout` — đăng xuất

## Kiểu dữ liệu công khai

Hướng dẫn về các kiểu TypeScript công khai (public types) nằm tại `docs/TYPE_GUIDELINES.md` — đọc file đó nếu bạn phát triển UI hoặc thêm API.

## Lưu ý bảo mật

- Đây là dự án demo; không lưu secrets vào repo. Khi deploy, dùng biến môi trường an toàn và cấu hình secrets trên nền tảng host.
- Chưa có các cơ chế production-ready như rate limiting, CSRF hardening hay log audit — cần bổ sung nếu chuyển môi trường.

## Contributing

- Đây là dự án do sinh viên; bạn có thể mở issue hoặc PR để góp ý. Nếu muốn thêm tính năng, hãy mô tả mục tiêu và cập nhật `docs/TYPE_GUIDELINES.md` nếu thay đổi các kiểu công khai.

## Tài nguyên

- Next.js: https://nextjs.org
- Prisma: https://www.prisma.io

---
Project created for learning/demo purposes. Not for production use.
