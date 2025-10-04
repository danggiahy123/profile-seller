# 🚀 Profile Seller - Quick Start Guide

## 📋 Cách chạy nhanh nhất

### **Option 1: VS Code Terminal (Khuyến nghị)**
```bash
# Trong VS Code Terminal (Ctrl + Shift + ý):
npm run build:css    # Build CSS đúng cách
npm run start         # Chạy cả backend + frontend
```

### **Option 2: .bat file**
```bash
# Double-click vào file:
start.bat            # Chạy tự động với thông tin chi tiết
terminal-only.bat    # Chỉ hiển thị hướng dẫn
```

### **Option 3: VS Code Tasks**
1. `Ctrl + Shift + P` → `Tasks: Run Task`
2. Chọn `🚀 Start Profile Seller`

## 🌐 URLs quan trọng

| Trang | URL | Mô tả |
|-------|-----|-------|
| **Entry Point** | http://localhost:5173/ | Trang chào mừng |
| **Login** | http://localhost:5173/pages/login.html | Đăng nhập |
| **Products** | http://localhost:5173/pages/products.html | Cửa hàng |
| **Admin** | http://localhost:5173/pages/admin-dashboard.html | Quản trị |

## 👤 Demo Accounts

| Role | Email | Password | Chức năng |
|------|-------|----------|-----------|
| **Admin** | `admin@profile-seller.com` | `admin123` | CRUD sản phẩm, Dashboard |
| **User** | `user@profile-seller.com` | `user123` | Xem sản phẩm, Wishlist, Cart |

## 🔧 Troubleshooting

### ❌ CSS không load (trang hiển thị đơn giản)
```bash
# Solution: Build CSS lại
npm run build:css

# Hoặc watch CSS để tự động rebuild
npm run watch:css
```

### ❌ Server không start
```bash
# Solution: Dừng và chạy lại
stop.bat
start.bat
```

### ❌ Port đã được sử dụng  
```bash
# Solution: Kill processes cụ thể
taskkill /f /im node.exe
Rồi chạy lại: npm run start
```

## ✅ Expected Results

**Trang Products phải có:**
- ✅ Cards đẹp với shadow và border radius
- ✅ Responsive grid layout
- ✅ Buttons với hover effects (teal color)
- ✅ Search bar với focus states
- ✅ Category filters đẹp
- ✅ Mobile responsive design

**Trang Login phải có:**
- ✅ Gradient background đẹp
- ✅ Form styling với focus states
- ✅ Demo account buttons
- ✅ Animated loading states

**Admin Dashboard phải có:**
- ✅ Stats cards với colors
- ✅ Product management table
- ✅ CRUD forms với proper styling
- ✅ Dashboard layout với sidebar

Nếu không thấy styling Tailwind CSS → chạy `npm run build:css` trước!

---

**Happy Coding! 🎉**
