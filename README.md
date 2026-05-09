# UMS - Hệ Thống Quản Lý Đào Tạo Đại Học

Hệ thống quản lý đào tạo toàn diện dành cho các trường đại học/cao đẳng, hỗ trợ 4 vai trò: **Quản trị viên**, **Giảng viên**, **Học viên** và **Kế toán**.

---

## Mục lục

- [Tổng quan](#tổng-quan)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Yêu cầu môi trường](#yêu-cầu-môi-trường)
- [Cài đặt & Chạy dự án](#cài-đặt--chạy-dự-án)
- [Biến môi trường](#biến-môi-trường)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [API Endpoints](#api-endpoints)
- [Đóng góp](#đóng-góp)

---

## Tổng quan

UMS (University Management System) là ứng dụng web full-stack được xây dựng nhằm số hóa và tự động hóa các nghiệp vụ quản lý trong môi trường giáo dục đại học, bao gồm:

- Quản lý học vụ (chương trình đào tạo, môn học, lớp học phần, đăng ký tín chỉ)
- Quản lý điểm số và đánh giá (bài tập, quiz, điểm thành phần)
- Quản lý học phí và tài chính
- Thông báo, liên hệ và hỗ trợ AI chatbot

---

## Tính năng

### Quản trị viên (Admin)
- Quản lý người dùng, vai trò và phân quyền chi tiết
- Quản lý cơ sở đào tạo: trường, khoa, ngành, chương trình đào tạo
- Quản lý học kỳ, môn học, học phần (lớp học phần), phòng học
- Quản lý học viên và nhân viên
- Quản lý đăng ký tín chỉ
- Quản lý lịch học và giờ học
- Quản lý nội dung (bài viết, thông báo)
- Báo cáo và thống kê tổng hợp
- Quản lý liên hệ & lịch sử liên hệ

### Giảng viên (Lecturer)
- Dashboard tổng quan lớp giảng dạy
- Quản lý lớp học phần, điểm danh
- Quản lý điểm số và bảng điểm thành phần
- Tạo và chấm bài tập, quiz
- Quản lý tài liệu học tập
- Gửi thông báo đến học viên
- Xem đánh giá từ học viên

### Học viên (Student)
- Dashboard tiến độ học tập
- Đăng ký tín chỉ theo học kỳ
- Xem thời khóa biểu, chương trình đào tạo
- Theo dõi tiến độ học tập và kết quả học tập
- Làm quiz và nộp bài tập trực tuyến
- Xem tài liệu học tập
- Quản lý học phí và lịch sử thanh toán
- Đánh giá giảng viên
- AI Chatbot hỗ trợ học tập

### Kế toán (Accountant)
- Dashboard tài chính tổng quan
- Quản lý hóa đơn học phí và công nợ
- Xử lý thanh toán
- Sổ quỹ và đối soát tài chính
- Báo cáo tài chính
- Quản lý ngoại lệ và lịch sử hoạt động

---

## Công nghệ sử dụng

### Backend
| Thành phần | Công nghệ |
|---|---|
| Framework | Spring Boot 3.5.5 |
| Ngôn ngữ | Java 21 |
| Build tool | Maven 3.9 |
| Database | PostgreSQL |
| ORM | Spring Data JPA / Hibernate |
| Bảo mật | Spring Security + JWT (JJWT 0.13.0) |
| Caching | Redis (Lettuce driver) |
| Email | SendGrid v4.10.3 |
| AI / Chatbot | LangChain4j 0.33.0 + Groq API |
| Excel | EasyExcel 3.3.2 |
| Connection pool | HikariCP |
| Utilities | Lombok, Jackson |

### Frontend
| Thành phần | Công nghệ |
|---|---|
| Framework | React 18.3.1 |
| Ngôn ngữ | TypeScript |
| Build tool | Vite 6.3.5 |
| Styling | Tailwind CSS 4.1.12 |
| UI Components | Radix UI, Material-UI v7, shadcn/ui |
| Charts | Recharts 2.15.2 |
| Form | React Hook Form 7.55.0 |
| Routing | React Router 7.13.0 |
| State | Zustand |
| HTTP | Axios 1.16.0 |
| Animation | Motion 12.23.24 |
| Drag & Drop | React DnD 16.0.1 |
| Toast | Sonner 2.0.3 |

---

## Kiến trúc hệ thống

```
┌──────────────────────────────────────────────────────────┐
│                      React Frontend                       │
│            (Vite + TypeScript + Tailwind CSS)             │
│   Admin │ Lecturer │ Student │ Accountant │ Auth Pages    │
└─────────────────────────┬────────────────────────────────┘
                          │ HTTP/REST (Axios)
                          ▼
┌──────────────────────────────────────────────────────────┐
│                   Spring Boot Backend                     │
│         Security Layer (JWT + Spring Security)            │
│  ┌───────────┐  ┌──────────┐  ┌────────┐  ┌──────────┐  │
│  │ Admin API │  │ Lecturer │  │Student │  │Accounting│  │
│  │ (31 ctrl) │  │   API    │  │  API   │  │   API    │  │
│  └───────────┘  └──────────┘  └────────┘  └──────────┘  │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              Service / Business Logic                │ │
│  └──────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              JPA Repositories (73 repos)             │ │
│  └──────────────────────────────────────────────────────┘ │
└──────┬──────────────────────────────────────┬────────────┘
       │                                      │
       ▼                                      ▼
┌─────────────┐                      ┌──────────────┐
│  PostgreSQL │                      │    Redis     │
│  (Primary   │                      │  (Caching +  │
│   Database) │                      │   Session)   │
└─────────────┘                      └──────────────┘
```

---

## Yêu cầu môi trường

- **Java** 21+
- **Maven** 3.9+
- **Node.js** 18+ và npm / pnpm
- **PostgreSQL** 14+
- **Redis** 7+
- Tài khoản **SendGrid** (cho email)
- Tài khoản **Groq** (cho AI chatbot, tùy chọn)

---

## Cài đặt & Chạy dự án

### 1. Clone repository

```bash
git clone <repository-url>
cd KLNHOM-main
```

### 2. Cấu hình Backend

Tạo file `.env` hoặc cấu hình biến môi trường (xem phần [Biến môi trường](#biến-môi-trường)).

```bash
cd ums_backend
mvn clean install -DskipTests
mvn spring-boot:run
```

Backend chạy tại: `http://localhost:8080`

### 3. Cấu hình Frontend

```bash
cd ums_frontend
npm install
npm run dev
```

Frontend chạy tại: `http://localhost:5173`

### 4. Chạy với Docker (Backend)

```bash
cd ums_backend
docker build -t ums-backend .
docker run -p 8080:8080 --env-file .env ums-backend
```

---

## Biến môi trường

### Backend (`ums_backend`)

| Biến | Mô tả | Ví dụ |
|---|---|---|
| `PORT` | Cổng chạy server | `8080` |
| `DB_HOST` | Host PostgreSQL | `localhost` |
| `DB_PORT` | Cổng PostgreSQL | `5432` |
| `DB_NAME` | Tên database | `ums_db` |
| `DB_USERNAME` | Tên user database | `postgres` |
| `DB_PASSWORD` | Mật khẩu database | `password` |
| `FUNCTION` | Hibernate DDL auto | `update` |
| `JWT_SECRET` | Khóa bí mật JWT | `your-secret-key` |
| `JWT_EXPIRATION` | Thời hạn JWT (ms) | `86400000` |
| `REDIS_HOST` | Host Redis | `localhost` |
| `REDIS_PORT` | Cổng Redis | `6379` |
| `REDIS_PASSWORD` | Mật khẩu Redis | `password` |
| `SENDGRID_API_KEY` | API key SendGrid | `SG.xxx` |
| `GROQ_API_KEY` | API key Groq (chatbot) | `gsk_xxx` |
| `GROQ_URL` | URL API Groq | `https://api.groq.com/...` |
| `ALLOWED_ORIGINS` | CORS origins | `http://localhost:5173` |

---

## Cấu trúc thư mục

```
KLNHOM-main/
├── ums_backend/                    # Spring Boot backend
│   ├── src/main/java/com/university/
│   │   ├── config/                 # Cấu hình Security, Redis, JWT
│   │   ├── controller/             # REST controllers (52 controllers)
│   │   │   ├── admin/              # 31 admin endpoints
│   │   │   ├── student/            # 17 student endpoints
│   │   │   ├── lecturer/           # Lecturer endpoints
│   │   │   ├── accounting/         # Accounting endpoints
│   │   │   ├── auth/               # Authentication endpoints
│   │   │   └── Notification/       # Notification endpoints
│   │   ├── dto/                    # Data Transfer Objects (162 DTOs)
│   │   │   ├── request/            # Request DTOs
│   │   │   └── response/           # Response DTOs
│   │   ├── entity/                 # JPA Entities (42 entities)
│   │   ├── enums/                  # Enum types (15 enums)
│   │   ├── exception/              # Global exception handling
│   │   ├── mapper/                 # DTO <-> Entity mappers (60+)
│   │   ├── repository/             # JPA Repositories (73 repos)
│   │   ├── service/                # Business logic (59 services)
│   │   │   ├── admin/
│   │   │   ├── student/
│   │   │   ├── lecturer/
│   │   │   ├── accounting/
│   │   │   └── Notification/
│   │   ├── util/                   # JWT utilities
│   │   └── ManagementApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── Dockerfile
│   └── pom.xml
│
└── ums_frontend/                   # React TypeScript frontend
    ├── src/
    │   ├── api/                    # Axios API layer (30+ modules)
    │   ├── components/             # Reusable components
    │   │   ├── layouts/            # Sidebar & Header per role
    │   │   ├── ui/                 # Base UI primitives (54+)
    │   │   ├── forms/              # Auth forms
    │   │   ├── modals/             # Modal dialogs
    │   │   ├── tables/             # Data tables
    │   │   ├── charts/             # Chart components
    │   │   └── chatbot/            # AI chatbot button
    │   ├── pages/                  # Page components (60+ pages)
    │   │   ├── admin/              # 23 admin pages
    │   │   ├── student/            # 19 student pages
    │   │   ├── lecturer/           # 10 lecturer pages
    │   │   ├── accounting/         # 13 accounting pages
    │   │   └── auth/               # Login page
    │   ├── hooks/                  # Custom React hooks
    │   ├── store/                  # Zustand state stores
    │   ├── routes/                 # Route definitions
    │   ├── constants/
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

---

## API Endpoints

Tất cả API đều có prefix `/api`. Xác thực qua JWT Bearer token.

### Authentication
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/refresh` | Làm mới token |
| POST | `/api/auth/logout` | Đăng xuất |
| POST | `/api/auth/forgot-password` | Quên mật khẩu |
| POST | `/api/auth/reset-password` | Đặt lại mật khẩu |

### Admin (yêu cầu role ADMIN)
| Prefix | Mô tả |
|---|---|
| `/api/admin/users` | Quản lý người dùng |
| `/api/admin/hoc-vien` | Quản lý học viên |
| `/api/admin/nhan-vien` | Quản lý nhân viên |
| `/api/admin/khoa` | Quản lý khoa |
| `/api/admin/nganh` | Quản lý ngành |
| `/api/admin/mon-hoc` | Quản lý môn học |
| `/api/admin/lop-hoc-phan` | Quản lý lớp học phần |
| `/api/admin/hoc-ki` | Quản lý học kỳ |
| `/api/admin/lich` | Quản lý lịch học |
| `/api/admin/phong` | Quản lý phòng học |
| `/api/admin/hoc-phi` | Quản lý học phí |
| `/api/admin/dang-ky-tin-chi` | Quản lý đăng ký tín chỉ |
| `/api/admin/role` | Quản lý vai trò |
| `/api/admin/permissions` | Quản lý phân quyền |
| `/api/admin/thong-bao` | Quản lý thông báo |

### Student (yêu cầu role STUDENT)
| Prefix | Mô tả |
|---|---|
| `/api/student/dashboard` | Dashboard học viên |
| `/api/student/dang-ky-tin-chi` | Đăng ký tín chỉ |
| `/api/student/lich` | Xem thời khóa biểu |
| `/api/student/hoc-phi` | Xem học phí |
| `/api/student/tien-do` | Tiến độ học tập |
| `/api/student/quiz` | Làm bài quiz |
| `/api/student/exercise` | Bài tập |
| `/api/student/tai-lieu` | Tài liệu học tập |
| `/api/student/thong-bao` | Thông báo |

### Lecturer (yêu cầu role LECTURER)
| Prefix | Mô tả |
|---|---|
| `/api/lecturer/classes` | Lớp học phần giảng dạy |
| `/api/lecturer/grades` | Quản lý điểm số |
| `/api/lecturer/attendance` | Điểm danh |
| `/api/lecturer/exercises` | Quản lý bài tập |

### Accounting (yêu cầu role ACCOUNTANT)
| Prefix | Mô tả |
|---|---|
| `/api/accounting/hoc-phi` | Quản lý học phí |
| `/api/accounting/bao-cao` | Báo cáo thống kê |

---

## Mô hình dữ liệu chính

```
Users ──── UserRole ──── Role ──── RolePermissions ──── Permissions
  │
  ├── HocVien (Học viên)
  │     ├── DangKyTinChi ──── LopHocPhan ──── MonHoc ──── Khoa
  │     ├── DiemThanhPhan ──── CotDiem
  │     ├── HocPhi ──── ThanhToanHocPhi
  │     ├── QuizAttempt ──── Quiz
  │     ├── SubmitExercise ──── Exercise
  │     └── DanhGiaGiangVien
  │
  ├── NhanVien (Nhân viên / Giảng viên)
  │     └── GiangDay ──── LopHocPhan
  │
  └── LopHocPhan
        ├── Lich ──── GioHoc ──── Phong
        ├── TaiLieu
        ├── CotDiem
        └── DiemDanh
```

---

## Đóng góp

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/ten-tinh-nang`
3. Commit thay đổi: `git commit -m "feat: mô tả tính năng"`
4. Push branch: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request vào nhánh `main`

---

## Thống kê dự án

| Hạng mục | Số lượng |
|---|---|
| Backend Java files | 477 |
| JPA Entities | 42 |
| REST Controllers | 52 |
| Business Services | 59 |
| JPA Repositories | 73 |
| DTO classes | 162 |
| Frontend pages | 60+ |
| Frontend API modules | 30+ |

---

*Dự án được phát triển phục vụ mục đích nghiên cứu và học thuật (Khóa luận tốt nghiệp).*
