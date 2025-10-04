// Products Page JavaScript

let currentProducts = [];
let currentPage = 1;
let totalPages = 1;
let selectedCategory = '';
let viewMode = 'grid';
let searchQuery = '';
let sortBy = 'newest';
let wishlist = [];
let cart = [];

const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializeProducts();
});

function checkAuth() {
    if (Auth.isAuthenticated()) {
        updateAuthenticatedUser();
    } else {
        updateUnauthenticatedUser();
    }
}

function updateAuthenticatedUser() {
    const user = Auth.getCurrentUser();
    const userInfo = document.getElementById('userInfo');
    const authButtons = document.getElementById('authButtons');
    
    if (user) {
        userInfo.innerHTML = `
            <div class="text-right">
                <p class="text-sm font-medium text-gray-900">${user.name}</p>
                <p class="text-xs text-gray-500">${user.email}</p>
            </div>
        `;
        
        authButtons.innerHTML = `
            <button onclick="goToAdmin()" class="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <i class="fas fa-user-tie mr-2"></i>
                Admin
            </button>
            <button onclick="logout()" class="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                <i class="fas fa-sign-out-alt mr-2"></i>
                Đăng xuất
            </button>
        `;
        
        // Show admin button if user is admin
        if (user.role === 'admin') {
            document.getElementById('authButtons').classList.remove('hidden');
        }
    }
    
    loadWishlist();
    loadCart();
}

function updateUnauthenticatedUser() {
    const userInfo = document.getElementById('userInfo');
    const authButtons = document.getElementById('authButtons');
    
    userInfo.innerHTML = `
        <div class="text-right">
            <p class="text-sm text-gray-500">Khách</p>
        </div>
    `;
    
    authButtons.innerHTML = `
        <button onclick="window.location.href='login.html'" class="bg-gradient-to-r from-teal-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-teal-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            Đăng nhập
        </button>
    `;
    
    loadWishlist();
    loadCart();
}

function initializeProducts() {
    setupEventListeners();
    loadProducts();
    loadSampleData();
}

function setupEventListeners() {
    // Hero search
    document.getElementById('heroSearchInput').addEventListener('input', debounce(handleSearch, 300));
    document.getElementById('heroSearchBtn').addEventListener('click', handleSearch);
    
    // Sort
    document.getElementById('sortSelect').addEventListener('change', handleSort);
    
    console.log('🛍️ Products event listeners setup complete');
}

async function loadProducts(page = 1) {
    showLoading(true);
    
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: '12',
            status: 'active' // Only show active products
        });
        
        if (selectedCategory) params.append('category', selectedCategory);
        if (searchQuery) params.append('search', searchQuery);
        
        const response = await fetch(`${API_BASE}/profiles?${params}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Lỗi khi tải sản phẩm');
        }
        
        currentProducts = data.profiles || [];
        totalPages = data.pagination?.pages || 1;
        
        // Apply sorting locally
        applySorting();
        
        renderProducts();
        updatePagination(data.pagination);
        
    } catch (error) {
        console.error('❌ Load products error:', error);
        showProductsError(error.message);
    } finally {
        showLoading(false);
    }
}

function applySorting() {
    switch (sortBy) {
        case 'newest':
            currentProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'price-asc':
            currentProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            currentProducts.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            // Mock popularity - can be replaced with real data
            currentProducts.sort((a, b) => Math.random() - 0.5);
            break;
    }
}

function renderProducts() {
    const container = document.getElementById('productsContainer');
    const loading = document.getElementById('loadingState');
    const empty = document.getElementById('emptyState');
    
    if (currentProducts.length === 0) {
        container.classList.add('hidden');
        loading.classList.add('hidden');
        empty.classList.remove('hidden');
        return;
    }
    
    container.classList.remove('hidden');
    loading.classList.add('hidden');
    empty.classList.add('hidden');
    
    container.innerHTML = `
        <div class="grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6">
            ${currentProducts.map(product => renderProductCard(product)).join('')}
        </div>
    `;
}

function renderProductCard(product) {
    const isInWishlist = wishlist.includes(product.id);
    const isInCart = cart.includes(product.id);
    
    return `
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex' : ''}">
            <!-- Product Image -->
            <div class="${viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'} bg-gray-100 flex items-center justify-center">
                <i class="fas fa-image text-4xl text-gray-400"></i>
            </div>
            
            <!-- Product Info -->
            <div class="p-6 ${viewMode === 'list' ? 'flex-1' : ''}">
                <div class="flex items-start justify-between mb-2">
                    <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">${product.title}</h3>
                    <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        ${getCategoryName(product.category)}
                    </span>
                </div>
                
                <p class="text-gray-600 text-sm mb-4 line-clamp-3">${product.description}</p>
                
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center text-yellow-500">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <span class="ml-1 text-gray-600 text-sm">(4.8)</span>
                    </div>
                    <span class="text-2xl font-bold text-teal-600">${formatCurrency(product.price)}</span>
                </div>
                
                <div class="flex items-center space-x-2">
                    <button 
                        onclick="viewProduct('${product.id}')"
                        class="flex-1 bg-gradient-to-r from-teal-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-teal-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        <i class="fas fa-eye mr-2"></i>
                        Xem chi tiết
                    </button>
                    
                    <button 
                        onclick="toggleWishlistItem('${product.id}')"
                        class="w-10 h-10 ${isInWishlist ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-600'} rounded-lg transition-colors"
                        title="${isInWishlist ? 'Bỏ yêu thích' : 'Thêm yêu thích'}"
                    >
                        <i class="fas fa-heart"></i>
                    </button>
                    
                    <button 
                        onclick="toggleCartItem('${product.id}')"
                        class="w-10 h-10 ${isInCart ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-teal-100 hover:text-teal-600'} rounded-lg transition-colors"
                        title="${isInCart ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ hàng'}"
                    >
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function updatePagination(pagination) {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    
    // Update buttons
    prevBtn.disabled = pagination.page <= 1;
    nextBtn.disabled = pagination.page >= pagination.pages;
    
    // Update page numbers (simple pagination for demo)
    pageNumbers.innerHTML = '';
    const maxVisiblePages = 5;
    const startPage = Math.max(1, pagination.page - 2);
    const endPage = Math.min(pagination.pages, pagination.page + 2);
    
    if (startPage > 1) {
        addPageButton(1);
        if (startPage > 2) {
            pageNumbers.appendChild(document.createElement('span')).textContent = '...';
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        addPageButton(i);
    }
    
    if (endPage < pagination.pages) {
        if (endPage < pagination.pages - 1) {
            pageNumbers.appendChild(document.createElement('span')).textContent = '...';
        }
        addPageButton(pagination.pages);
    }
    
    function addPageButton(page) {
        const button = document.createElement('button');
        button.textContent = page;
        button.className = `px-3 py-2 text-sm border rounded-lg mr-1 ${
            page === pagination.page 
                ? 'bg-teal-500 text-white border-teal-500' 
                : 'border-gray-300 hover:bg-gray-50'
        }`;
        button.onclick = () => changePage(page);
        pageNumbers.appendChild(button);
    }
}

function changePage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    loadProducts(page);
}

function handleSearch(event) {
    const searchInput = document.getElementById('heroSearchInput');
    searchQuery = searchInput.value.trim();
    currentPage = 1;
    loadProducts(1);
}

function handleSort(event) {
    sortBy = event.target.value;
    applySorting();
    renderProducts();
}

function setCategory(category) {
    selectedCategory = category;
    
    // Update UI
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('bg-teal-500', 'text-white');
        btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300', 'hover:bg-gray-50');
    });
    
    event.target.classList.add('bg-teal-500', 'text-white');
    event.target.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
    
    currentPage = 1;
    loadProducts(1);
}

function setViewMode(mode) {
    viewMode = mode;
    
    // Update buttons
    const gridBtn = document.getElementById('gridViewBtn');
    const listBtn = document.getElementById('listViewBtn');
    
    if (mode === 'grid') {
        gridBtn.classList.add('bg-teal-500', 'text-white');
        gridBtn.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
        listBtn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
        listBtn.classList.remove('bg-teal-500', 'text-white');
    } else {
        listBtn.classList.add('bg-teal-500', 'text-white');
        listBtn.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
        gridBtn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
        gridBtn.classList.remove('bg-teal-500', 'text-white');
    }
    
    renderProducts();
}

function viewProduct(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    
    // Fill content
    document.getElementById('modalProductTitle').textContent = product.title;
    document.getElementById('modalProductPrice').textContent = formatCurrency(product.price);
    document.getElementById('modalCheckoutPrice').textContent = formatCurrency(product.price);
    document.getElementById('modalTotalPrice').textContent = formatCurrency(product.price);
    document.getElementById('modalProductCategory').textContent = getCategoryName(product.category);
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalProductContent').textContent = product.content || 'Nội dung chi tiết sẽ có sau.';
    
    // Store product ID for purchase
    modal.dataset.productId = productId;
    
    modal.classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('productModal').classList.add('hidden');
}

function purchaseProduct() {
    const modal = document.getElementById('productModal');
    const productId = modal.dataset.productId;
    
    if (!Auth.isAuthenticated()) {
        showToast('warning', 'Cần đăng nhập', 'Vui lòng đăng nhập để mua sản phẩm');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    addToCart(productId);
    showToast('success', 'Thành công', 'Đã thêm vào giỏ hàng để thanh toán');
    closeProductModal();
}

function addToWishlist() {
    const modal = document.getElementById('productModal');
    const productId = modal.dataset.productId;
    
    if (!Auth.isAuthenticated()) {
        showToast('warning', 'Cần đăng nhập', 'Vui lòng đăng nhập để thêm vào yêu thích');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    toggleWishlistItem(productId);
    showToast('success', 'Thành công', 'Đã thêm vào danh sách yêu thích');
}

function toggleWishlistItem(productId) {
    if (!Auth.isAuthenticated()) {
        showToast('warning', 'Cần đăng nhập', 'Vui lòng đăng nhập để sử dụng tính năng này');
        return;
    }
    
    const index = wishlist.indexOf(productId);
    
    if (index === -1) {
        wishlist.push(productId);
    } else {
        wishlist.splice(index, 1);
    }
    
    saveWishlist();
    updateWishlistCount();
    renderProducts(); // Refresh to update buttons
    
    const action = index === -1 ? 'thêm vào' : 'bỏ khỏi';
    showToast('success', 'Thành công', `Đã ${action} danh sách yêu thích`);
}

function toggleCartItem(productId) {
    if (!Auth.isAuthenticated()) {
        showToast('warning', 'Cần đăng nhập', 'Vui lòng đăng nhập để thêm vào giỏ hàng');
        return;
    }
    
    const index = cart.indexOf(productId);
    
    if (index === -1) {
        cart.push(productId);
    } else {
        cart.splice(index, 1);
    }
    
    saveCart();
    updateCartCount();
    renderProducts(); // Refresh to update buttons
    
    const action = index === -1 ? 'thêm vào' : 'bỏ khỏi';
    showToast('success', 'Thành công', `Đã ${action} giỏ hàng`);
}

function loadWishlist() {
    const saved = localStorage.getItem('wishlist');
    wishlist = saved ? JSON.parse(saved) : [];
    updateWishlistCount();
}

function loadCart() {
    const saved = localStorage.getItem('cart');
    cart = saved ? JSON.parse(saved) : [];
    updateCartCount();
}

function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateWishlistCount() {
    document.getElementById('wishlistCount').textContent = wishlist.length;
    document.getElementById('wishlistCount').style.display = wishlist.length > 0 ? 'block' : 'none';
}

function updateCartCount() {
    document.getElementById('cartCount').textContent = cart.length;
    document.getElementById('cartCount').style.display = cart.length > 0 ? 'block' : 'none';
}

function clearFilters() {
    searchQuery = '';
    selectedCategory = '';
    currentPage = 1;
    
    document.getElementById('heroSearchInput').value = '';
    setCategory('');
    loadProducts(1);
}

function showLoading(show) {
    const loading = document.getElementById('loadingState');
    const container = document.getElementById('productsContainer');
    
    if (show) {
        loading.classList.remove('hidden');
        container.classList.add('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

function showProductsError(message) {
    const loading = document.getElementById('loadingState');
    const container = document.getElementById('productsContainer');
    const empty = document.getElementById('emptyState');
    
    loading.classList.add('hidden');
    container.classList.add('hidden');
    empty.classList.remove('hidden');
    
    showToast('error', 'Lỗi', message);
}

function goToAdmin() {
    if (Auth.isAdmin()) {
        window.location.href = 'admin-dashboard.html';
    } else {
        showToast('error', 'Không có quyền', 'Chỉ admin mới được truy cập');
    }
}

function goToProducts() {
    window.location.href = 'products.html';
}

function logout() {
    Auth.logout();
}

async function loadSampleData() {
    try {
        // Load some sample profiles if database is empty
        const response = await fetch(`${API_BASE}/profiles?limit=1`);
        const data = await response.json();
        
        if (!response.ok || data.profiles.length === 0) {
            console.log('🔄 Loading sample products...');
            // Add sample products
            const sampleProducts = [
                {
                    title: "Modern Website Design",
                    description: "Thiết kế website hiện đại với responsive design và tốc độ tải nhanh",
                    price: 1500000,
                    category: "design",
                    tags: ["web", "design", "responsive"],
                    content: "Bao gồm mockup, prototype và source code HTML/CSS"
                },
                {
                    title: "E-commerce App Development",
                    description: "Ứng dụng mua sắm trực tuyến với đầy đủ tính năng thanh toán",
                    price: 5000000,
                    category: "development",
                    tags: ["react", "nodejs", "mongodb"],
                    content: "Full-stack application với React frontend và Node.js backend"
                },
                {
                    title: "Social Media Marketing Package",
                    description: "Chiến lược marketing trên các nền tảng mạng xã hội",
                    price: 3000000,
                    category: "marketing",
                    tags: ["facebook", "instagram", "marketing"],
                    content: "Strategy, content calendar, và analytics report"
                },
                {
                    title: "Professional Photography",
                    description: "Dịch vụ chụp ảnh chuyên nghiệp cho sự kiện và quảng cáo",
                    price: 2000000,
                    category: "photo",
                    tags: ["photography", "event", "professional"],
                    content: "Package 100 ảnh chất lượng cao + chỉnh sửa"
                },
                {
                    title: "UI/UX Design System",
                    description: "Hệ thống thiết kế UI/UX chuẩn cho dự án lớn",
                    price: 4500000,
                    category: "design",
                    tags: ["ui", "ux", "design-system"],
                    content: "Component library, style guide và documentation"
                },
                {
                    title: "Mobile App Backend API",
                    description: "API backend cho ứng dụng di động với bảo mật cao",
                    price: 4000000,
                    category: "development",
                    tags: ["api", "nodejs", "security"],
                    content: "REST API với authentication và database integration"
                }
            ];
            
            // Create sample products one by one
            for (const product of sampleProducts) {
                await fetch(`${API_BASE}/profiles`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...product,
                        status: 'active',
                        sellerId: '507f1f77bcf86cd799439011' // Mock seller ID
                    })
                });
            }
            
            console.log('✅ Sample products created');
            loadProducts(currentPage); // Reload after creating samples
        }
    } catch (error) {
        console.error('❌ Sample data error:', error);
    }
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function getCategoryName(category) {
    const names = {
        'design': 'Design',
        'development': 'Development',
        'marketing': 'Marketing',
        'photo': 'Photography'
    };
    return names[category] || category;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showToast(type, title, message) {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    const icons = {
        success: 'fa-check-circle text-green-500',
        error: 'fa-exclamation-triangle text-red-500',
        warning: 'fa-exclamation-circle text-yellow-500',
        info: 'fa-info-circle text-blue-500'
    };
    
    toastIcon.className = `fas mr-3 ${icons[type]}`;
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 5000);
}

function hideToast() {
    document.getElementById('toast').classList.add('hidden');
}

console.log('🛍️ Products page initialized');
