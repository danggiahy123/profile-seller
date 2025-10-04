# 🗂️ Cấu trúc dự án sau khi tái tổ chức

## 📁 Tổng quan cấu trúc

```
📦 Profile Seller/
│
├── 🌐 index.html                # Entry point chính (redirect)
├── 🚀 start.bat                 # Khởi động hệ thống
├── 🛑 stop.bat                  # Dừng hệ thống
├── 📚 package.json              # Dependencies Node.js
│
├── 📄 pages/                    # Tất cả trang HTML
│   ├── index.html              # Landing page chính
│   ├── login.html              # Trang đăng nhập  
│   ├── products.html           # Cửa hàng sản phẩm
│   └── admin-dashboard.html    # Dashboard admin
│
├── 💻 scripts/                 # JavaScript & CSS
│   ├── auth.js                 # Authentication logic
│   ├── admin.js                # Admin functions  
│   ├── products.js             # Products functions
│   └── style.css               # Tailwind CSS
│
├── ⚙️ config/                  # Configuration files
│   ├── tailwind.config.js      # Tailwind CSS config
│   └── postcss.config.js       # PostCSS config
│
├── 🗄️ backend/                 # Backend API
│   ├── test-server.js          # Mock API server
│   └── routes/                 # API endpoints
│       ├── auth.js             # Login/Register routes
│       ├── profiles.js         # Products CRUD routes
│       ├── users.js           # User management routes
│       └── orders.js          # Orders routes
│
├── 📖 docs/                     # Documentation
│   ├── README.md               # Hướng dẫn chính
│   ├── PROJECT_INFO.md         # Thông tin chi tiết
│   └── STRUCTURE.md            # File này
│
└── 📦 node_modules/            # Dependencies (auto-generated)
```

## 🔗 Các URL sau khi tổ chức

| Page | Old URL | New URL |
|------|---------|---------|
| Homepage | `/index.html` | `/pages/index.html` |
| Login | `/login.html` | `/pages/login.html` |
| Products | `/products.html` | `/pages/products.html` |
| Admin Dashboard | `/admin-dashboard.html` | `/pages/admin-dashboard.html` |

## 🎯 Lợi ích của cấu trúc mới

### ✅ **Tổ chức r logic:**
- **`pages/`** - Tất cả HTML pages
- **`scripts/`** - Tất cả JavaScript & CSS  
- **`config/`** - Configuration files
- **`docs/`** - Documentation
- **`backend/`** - Backend API hoàn toàn riêng biệt

### ✅ **Dễ bảo trì:**
- Frontend và Backend tách biệt rõ ràng
- CSS/JS được nhóm lại thành một thư mục
- Configuration files tập trung
- Documentation đầy đủ

### ✅ **Scalable:**
- Dễ dàng thêm pages mới vào `pages/`
- Dễ dàng thêm scripts mới vào `scripts/`
- Backend có thể tách thành repository riêng

## 🚀 Cách sử dụng

```bash
# Khởi động hệ thống
start.bat

# Mở browser tại:
http://localhost:5173          # Entry point chính
http://localhost:5173/pages/login.html  # Login trực tiếp
```

## 📝 Ghi chú quan trọng

- ✅ All HTML files đã được update đường dẫn CSS/JS mới
- ✅ Backend API endpoints không thay đổi
- ✅ Database schema và functionality giữ nguyên
- ✅ Demo accounts vẫn hoạt động bình thường
