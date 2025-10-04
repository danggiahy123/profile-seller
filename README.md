# Profile Seller - Web Admin

Giao diện web admin cho hệ thống Profile Seller với Tailwind CSS.

## ✨ Tính năng

- 📊 **Dashboard**: Tổng quan hệ thống với thống kê và biểu đồ
- 👥 **Quản lý người dùng**: Quản lý người dùng và phân quyền
- 🆔 **Quản lý Profile**: Quản lý profile và danh mục sản phẩm  
- 🛒 **Quản lý đơn hàng**: Xem và xử lý đơn hàng
- 📈 **Phân tích**: Báo cáo và thống kê chi tiết
- ⚙️ **Cài đặt**: Cấu hình hệ thống

## 🚀 Cài đặt

### Yêu cầu hệ thống
- Node.js 16+ 
- npm hoặc yarn

### Các bước cài đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd profile-seller
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Chạy development server**
```bash
npm run dev
```

4. **Mở trình điều web**
Truy cập `http://localhost:3000` để xem giao diện admin.

## 📁 Cấu trúc thư mục

```
profile-seller/
├── index.html              # Trang chính
├── package.json           # Cấu hình dự án
├── tailwind.config.js     # Cấu hình Tailwind CSS
├── postcss.config.js      # Cấu hình PostCSS
├── README.md             # Tài liệu dự án
└── src/
    ├── style.css         # CSS chính với Tailwind
    └── app.js           # JavaScript ứng dụng
```

## 🎨 Customization

### Thay đổi màu sắc
Bạn có thể chỉnh sửa màu sắc trong file `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Thay đổi màu primary của bạn
        500: '#your-color',
      }
    }
  }
}
```

### Thêm Component tùy chỉnh
Thêm component trong file `src/style.css`:

```css
@layer components {
  .your-custom-component {
    @apply /* Tailwind classes */;
  }
}
```

## 🛠️ Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build dự án cho production  
- `npm run preview` - Xem trước build

## 🎯 Tính năng JavaScript

- **Navigation**: Điều hướng giữa các trang
- **Responsive**: Hỗ trợ mobile và desktop
- **Search**: Tính năng tìm kiếm
- **Notifications**: Thông báo hệ thống
- **Data Loading**: Tải dữ liệu động

## 📱 Responsive Design

Giao diện được thiết kế responsive với:
- **Desktop**: Sidebar cố định, layout 2 cột
- **Tablet**: Sidebar có thể thu gọn
- **Mobile**: Sidebar dạng drawer, layout 1 cột

## 🔧 Development

### Thêm trang mới
1. Thêm navigation item vào `index.html`
2. Tạo page content trong `loadPageContent()` hàm
3. Xử lý logic trang trong file `app.js`

### Thêm API integration
Bạn có thể tích hợp với backend API bằng cách:
1. Thêm HTTP client (fetch, axios)
2. Thay thế mock data trong các hàm loader
3. Thêm error handling

## 📦 Dependencies

- **Vite**: Development server và build tool
- **Tailwind CSS**: Utility-first CSS framework  
- **Autoprefixer**: CSS vendor prefixes
- **PostCSS**: CSS processing

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit thay đổi
4. Push và tạo Pull Request

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 📞 Support

Nếu có câu hỏi hoặc cần hỗ trợ, liên hệ:
- Email: support@example.com
- Issues: [GitHub Issues](link-to-issues)
"# profile-seller" 
