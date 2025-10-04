# 📱 Profile Seller - Responsive Design Guide

## 🎯 Breakpoints Supported

| Device Type | Screen Width | Breakpoint | Layout |
|-------------|--------------|------------|---------|
| **Mobile Small** | 320px - 575px | `≤ 575px` | 1 column, compact spacing |
| **Mobile Large** | 576px - 767px | `576px - 767px` | 1 column, normal spacing |
| **Tablet** | 768px - 991px | `768px - 991px` | 2 columns |
| **Desktop Small** | 992px - 1199px | `992px - 1199px` | 3 columns |
| **Desktop Large** | 1200px+ | `≥ 1200px` | 4 columns |

## 📍 Test URLs

Base URL: http://localhost:5173

### Primary Test Pages:
- **Products**: `/pages/products.html` ⭐ (Main responsive test)
- **Login**: `/pages/login.html`
- **Admin Dashboard**: `/pages/admin-dashboard.html`
- **Landing**: `/pages/index.html`

## 🔍 Manual Testing Steps

### 📱 **Mobile Testing (320px - 767px)**

1. **Open DevTools** (`F12`)
2. **Toggle device toolbar** (`Ctrl + Shift + M`)
3. **Test devices**:
   ```
   📱 iPhone SE: 375 x 667
   📱 iPhone 12: 390 x 844  
   📱 Samsung Galaxy: 412 x 915
   📱 iPad Portrait: 768 x 1024
   ```

**Expected Mobile Results:**
- ✅ **Single column** product grid
- ✅ **Full-width buttons** với min-height 44px (touch-friendly)
- ✅ **Stacked navigation** elements
- ✅ **Reduced padding** trong containers
- ✅ **Larger touch targets** cho buttons/links

---

### 💻 **Tablet Testing (768px - 1023px)**

**Test devices:**
```
📱 iPad Landscape: 1024 x 768
📱 iPad Pro Portrait: 834 x 1194
📱 Surface: 912 x 1368
```

**Expected Tablet Results:**
- ✅ **2-column** product grid
- ✅ **Medium padding** trong containers
- ✅ **Side-by-side** navigation elements
- ✅ **Optimized button sizes**

---

### 💻 **Desktop/Laptop Testing (1024px+)**

**Test resolutions:**
```
💻 MacBook Air: 1440 x 900
💻 MacBook Pro: 1600 x 1024  
💻 Laptop HD: 1366 x 768
💻 Desktop: 1920 x 1080
```

**Expected Desktop Results:**
- ✅ **3-column** grid (1024px - 1199px)
- ✅ **4-column** grid (1200px+)
- ✅ **Full-width** layouts với optimal spacing
- ✅ **Hover effects** fully functional
- ✅ **Large images** và text

---

## 🧪 Automated Testing Commands

### Chrome DevTools Console Testing:

```javascript
// Test responsive breakpoints
function testResponsive() {
  const widths = [320, 576, 768, 992, 1200, 1440];
  widths.forEach(width => {
    if (window.innerWidth !== width) {
      window.resizeTo(width, 800);
      console.log(`Testing ${width}px width...`);
    }
  });
}

// Check if mobile classes applied
function checkMobileClasses() {
  const mobileClasses = document.querySelectorAll('.mobile-hide, .mobile-full');
  console.log('Mobile classes found:', mobileClasses.length);
}

// Test touch targets
function checkTouchTargets() {
  const buttons = document.querySelectorAll('button, .btn-primary, .btn-outline');
  const undersized = Array.from(buttons).filter(btn => {
    const rect = btn.getBoundingClientRect();
    return rect.height < 44 || rect.width < 44;
  });
  console.log(`${undersized.length} buttons below 44px touch target`);
}
```

## ✅ Expected Visual Results

### 📱 **Mobile Layout (375px width)**
```
┌─────────────────────────────┐
│ Profile Seller             │
│ Cửa hàng sản phẩm          │
│ Regular User               │
├─────────────────────────────┤
│ 🔍 [Search products...]   │
├─────────────────────────────┤
│ ┌─────────┐                │
│ │ 📷      │ Modern Website │
│ │ Image   │ ⭐⭐⭐⭐⭐     │
│ │ Design  │ ₫1.5M         │
│ └─────────┘ [Chi tiết]     │
├─────────────────────────────┤
│ ┌─────────┐                │
│ │ 📷      │ E-commerce...  │
│ │ Image   │ ⭐⭐⭐⭐⭐     │
│ │ Dev     │ ₫5.0M         │
│ └─────────┘ [Chi tiết]     │
└─────────────────────────────┘
```

### 💻 **Desktop Layout (1200px+ width)**
```
┌─────────────────────────────────────────────────────────┐
│ Profile Seller        🔍[Search...] [🔍] [❤️] [🛒] [Admin] │
├─────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │ Design  │ │ Development│ │ Marketing│ │ Photography│      │
│ │ ⭐⭐⭐⭐⭐ │ │ ⭐⭐⭐⭐⭐│ │ ⭐⭐⭐⭐⭐│ │ ⭐⭐⭐⭐⭐│     │
│ │ ₫1.5M   │ │ ₫5.0M   │ │ ₫3.0M   │ │ ₫2.5M   │     │
│ │[Chi tiết]│ │[Chi tiết]│ │[Chi tiết]│ │[Chi tiết]│     │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘        │
└─────────────────────────────────────────────────────────┘
```

## 🐛 Troubleshooting

### **Links not working:**
- Check console for 404 errors
- Verify CSS file loading: `styles-responsive.css`

### **Layout breaking:**
- Clear browser cache (`Ctrl + Shift + Delete`)
- Hard refresh (`Ctrl + Shift + R`)

### **Mobile not responsive:**
- Check viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Verify CSS breakpoints trong DevTools

### **Desktop too cramped:**
- Check max-width containers
- Verify grid column counts

---

## 🎯 Testing Checklist

### Mobile (≤ 767px)
- [ ] Product cards stack vertically
- [ ] Buttons full-width với proper spacing
- [ ] Touch targets ≥ 44px
- [ ] Text readable without zooming
- [ ] Search bar full-width
- [ ] Navigation simplifies appropriately

### Tablet (768px - 1023px)
- [ ] 2-column product grid
- [ ] Balanced spacing
- [ ] Navigation elements side-by-side
- [ ] Medium font sizes

### Desktop (≥ 1024px)
- [ ] 3-4 column grid layout
- [ ] Full navigation bar
- [ ] Hover effects working
- [ ] Optimal spacing
- [ ] Large, comfortable text

### All Devices
- [ ] Images don't overflow
- [ ] Text remains readable
- [ ] Buttons clickable
- [ ] Consistent branding/colors
- [ ] Loading animations work

---

**Happy Testing! 📱** 🎉
