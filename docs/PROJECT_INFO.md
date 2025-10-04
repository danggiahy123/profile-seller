# 📱 Profile Seller

Ứng dụng web thương mại điện tử - Bán và quản lý sản phẩm số

## 🚀 Cách chạy

```bash
# Chạy servers
start.bat

# Dừng servers  
stop.bat
```

## 🌐 URLs

- **Website:** http://localhost:5173
- **Login:** http://localhost:5173/login.html
- **Products:** http://localhost:5173/products.html
- **Admin:** http://localhost:5173/admin-dashboard.html

## 👤 Tài khoản demo

| Role  | Email | Password | Chức năng |
|-------|-------|----------|-----------|
| Admin | admin@profile-seller.com | admin123 | Quản lý sản phẩm (CRUD) |
| User  | user@profile-seller.com | user123 | Xem sản phẩm + Cart/Wishlist |

## 📁 Cấu trúc chính

```
├── 📄 index.html          # Trang chủ
├── 🔐 login.html           # Đăng nhập  
├── 🛍️ products.html        # Cửa hàng sản phẩm
├── 👑 admin-dashboard.html # Dashboard quản trị
├── 📁 src/                 # Styles & Scripts
├── 📁 backend/             # API Server
└── 🎯 package.json         # Dependencies
```

## ⚡ Tính năng

- ✅ **Authentication:** Đăng nhập/Đăng xuất với 2 role
- ✅ **Product Management:** CRUD sản phẩm cho admin
- ✅ **Shopping:** Danh sách, search, filter cho user
- ✅ **Responsive Design:** Mobile/Desktop hoàn hảo
- ✅ **Mock API:** Backend server với data mẫu
