// Fixed Products UI JavaScript

let currentProducts = [];
let currentPage = 1;
let totalPages = 1;
let selectedCategory = '';
let viewMode = 'grid';
let searchQuery = '';
let sortBy = 'newest';
let wishlist = [];
let cart = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializeProducts();
    setupEventListeners();
});

function checkAuth() {
    if (typeof Auth !== 'undefined' && Auth.isAuthenticated()) {
        updateAuthenticatedUser();
    } else {
        updateUnauthenticatedUser();
    }
}

function updateAuthenticatedUser() {
    const user = Auth ? Auth.getCurrentUser() : null;
    const userInfo = document.getElementById('userInfo');
    const authButtons = document.getElementById('authButtons');
    
    if (userInfo && authButtons && user) {
        userInfo.innerHTML = `
            <p class="text-sm font-medium text-gray-900">Xin chào, ${user.email}</p>
            ${user.role === 'admin' ? '<p class="text-xs text-gray-500">Quản trị viên</p>' : ''}
        `;
        
        authButtons.innerHTML = `
            ${user.role === 'admin' ? `
                <a href="admin-dashboard.html" class="btn btn-primary">
                    <i class="fas fa-cog mr-2"></i>
                    Admin Panel
                </a>
            ` : ''}
            <button onclick="logout()" class="btn btn-outline">
                <i class="fas fa-sign-out-alt mr-2"></i>
                Đăng xuất
            </button>
        `;
    }
}

function updateUnauthenticatedUser() {
    const userInfo = document.getElementById('userInfo');
    const authButtons = document.getElementById('authButtons');
    
    if (userInfo && authButtons) {
        userInfo.innerHTML = '';
        authButtons.innerHTML = `
            <a href="login.html" class="btn btn-primary">
                <i class="fas fa-sign-in-alt mr-2"></i>
                Đăng nhập
            </a>
            <a href="register.html" class="btn btn-outline">
                <i class="fas fa-user-plus mr-2"></i>
                Đăng ký
            </a>
        `;
    }
}

function logout() {
    if (typeof Auth !== 'undefined') {
        Auth.logout();
        window.location.reload();
    }
}

function initializeProducts() {
    loadProducts();
    loadWishlist();
    loadCart();
}

function loadProducts() {
    const loading = document.getElementById('loadingState');
    if (loading) loading.classList.remove('hidden');
    
    // Simulate API call with mock data
    setTimeout(() => {
        currentProducts = getMockProducts();
        renderProducts();
        updateStats();
    }, 1000);
}

function getMockProducts() {
    return [
        {
            id: '1',
            title: 'Modern Web Design Template',
            description: 'Professional web template với thiết kế responsive và hiện đại',
            price: 299000,
            category: 'design',
            status: 'active',
            seller: 'DesignStudio',
            createdAt: new Date('2024-01-15'),
            tags: ['responsive', 'modern', 'professional']
        },
        {
            id: '2',
            title: 'E-Commerce Development Course',
            description: 'Khóa học phát triển trang web thương mại điện tử từ A-Z',
            price: 849000,
            category: 'development',
            status: 'active',
            seller: 'TechAcademy',
            createdAt: new Date('2024-01-20'),
            tags: ['javascript', 'react', 'nodejs']
        },
        {
            id: '3',
            title: 'Social Media Marketing Kit',
            description: 'Bộ công cụ marketing mạng xã hội với templates và guides',
            price: 199000,
            category: 'marketing',
            status: 'active',
            seller: 'MarketingPro',
            createdAt: new Date('2024-01-25'),
            tags: ['social', 'marketing', 'templates']
        },
        {
            id: '4',
            title: 'Photography Portfolio Template',
            description: 'Template portfolio nhiếp ảnh chuyên nghiệp với gallery',
            price: 449000,
            category: 'photo',
            status: 'active',
            seller: 'PhotoStudio',
            createdAt: new Date('2024-01-30'),
            tags: ['photography', 'portfolio', 'gallery']
        },
        {
            id: '5',
            title: 'UI/UX Design Components',
            description: 'Thư viện components UI/UX với Figma và code',
            price: 699000,
            category: 'design',
            status: 'active',
            seller: 'UIDesign',
            createdAt: new Date('2024-02-01'),
            tags: ['ui', 'ux', 'components']
        },
        {
            id: '6',
            title: 'Mobile App Development',
            description: 'Hướng dẫn phát triển ứng dụng mobile đa nền tảng',
            price: 1199000,
            category: 'development',
            status: 'active',
            seller: 'MobileDev',
            createdAt: new Date('2024-02-05'),
            tags: ['mobile', 'react-native', 'flutter']
        }
    ];
}

function renderProducts() {
    const container = document.getElementById('productsContainer');
    const loading = document.getElementById('loadingState');
    const empty = document.getElementById('emptyState');
    
    if (!container) return;
    
    if (currentProducts.length === 0) {
        container.classList.add('hidden');
        if (loading) loading.classList.add('hidden');
        if (empty) empty.classList.remove('hidden');
        return;
    }
    
    // Use optimized CSS classes
    container.className = 'products-grid';
    container.innerHTML = currentProducts.map(product => renderProductCard(product)).join('');
    container.classList.remove('hidden');
    
    if (loading) loading.classList.add('hidden');
    if (empty) empty.classList.add('hidden');
    
    updatePagination();
}

function renderProductCard(product) {
    const isInWishlist = wishlist.includes(product.id);
    const isInCart = cart.includes(product.id);
    
    return `
        <div class="product-item" onclick="viewProduct('${product.id}')">
            <!-- Product Image -->
            <div class="product-image-placeholder relative">
                <i class="fas fa-image"></i>
                
                <!-- Category Badge -->
                <div class="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                    ${getCategoryName(product.category)}
                </div>
                
                <!-- Wishlist Button -->
                <button onclick="event.stopPropagation(); toggleWishlistItem('${product.id}')" 
                        class="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center ${isInWishlist ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors">
                    <i class="fas fa-heart ${isInWishlist ? 'fas' : 'far'}"></i>
                </button>
            </div>
            
            <!-- Product Info -->
            <div class="product-info">
                <!-- Rating -->
                <div class="rating-stars mb-2">
                    ${Array(5).fill('<i class="fas fa-star text-yellow-400"></i>').join('')}
                    <span class="ml-1 text-sm text-gray-500">(4.8)</span>
                </div>
                
                <!-- Title -->
                <h3 class="product-title">${product.title}</h3>
                
                <!-- Description -->
                <p class="product-description">${product.description}</p>
                
                <!-- Price & Status -->
                <div class="flex items-center justify-between mb-3">
                    <span class="price-tag">${formatCurrency(product.price)}</span>
                    <span class="px-2 py-1 rounded-full text-xs font-medium ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${product.status === 'active' ? 'Có sẵn' : 'Tạm hết'}
                    </span>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex space-x-2">
                    <button onclick="event.stopPropagation(); viewProduct('${product.id}')" 
                            class="flex-1 btn btn-primary text-sm">
                        <i class="fas fa-eye mr-2"></i>
                        Xem chi tiết
                    </button>
                    ${product.status === 'active' ? `
                        <button onclick="event.stopPropagation(); ${isInCart ? 'removeFromCart' : 'addToCart'}(\`${product.id}\`)" 
                                class="px-3 py-2 ${isInCart ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} text-white rounded-md transition-colors">
                            <i class="fas ${isInCart ? 'fa-check' : 'fa-shopping-cart'}"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function viewProduct(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if (!product) return;
    
    showProductModal(product);
}

function showProductModal(product) {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    // Update modal content
    document.getElementById('modalProductTitle').textContent = product.title;
    document.getElementById('modalProductPrice').textContent = formatCurrency(product.price);
    document.getElementById('modalProductCategory').textContent = getCategoryName(product.category);
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalProductContent').textContent = product.tags ? product.tags.join(', ') : 'Nội dung chi tiết về sản phẩm';
    document.getElementById('modalCheckoutPrice').textContent = formatCurrency(product.price);
    document.getElementById('modalTotalPrice').textContent = formatCurrency(product.price);
    
    modal.classList.remove('hidden');
}

function closeProductModal() {
    const paraModal = document.getElementById('productModal');
    if (paraModal) paraModal.classList.add('hidden');
}

function toggleWishlistItem(productId) {
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        showToast('Đã thêm vào yêu thích');
    } else {
        wishlist = wishlist.filter(id => id !== productId);
        showToast('Đã xóa khỏi yêu thích');
    }
    
    saveWishlist();
    updateWishlistCount();
    renderProducts(); // Re-render để cập nhật UI
}

function addToCart(productId) {
    if (!cart.includes(productId)) {
        cart.push(productId);
        showToast('Đã thêm vào giỏ hàng');
        saveCart();
        updateCartCount();
        renderProducts();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(id => id !== productId);
    showToast('Đã xóa khỏi giỏ hàng');
    saveCart();
    updateCartCount();
    renderProducts();
}

function purchaseProduct() {
    const product = currentProducts.find(p => p.id);
    if (product) {
        showToast(`Đã mua sản phẩm: ${product.title}`);
        closeProductModal();
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.remove('hidden');
        const messageEl = toast.querySelector('p');
        if (messageEl) messageEl.textContent = message;
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function getCategoryName(category) {
    const categories = {
        'design': 'Design',
        'development': 'Development',
        'marketing': 'Marketing',
        'photo': 'Photography'
    };
    return categories[category] || category;
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('heroSearchInput');
    const heroSearchBtn = document.getElementById('heroSearchBtn');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            filterProducts();
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                filterProducts();
            }
        });
    }
    
    if (heroSearchBtn) {
        heroSearchBtn.addEventListener('click', filterProducts);
    }
    
    // Category filters
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.dataset.category || '';
            setCategory(category);
        });
    });
    
    // Sort dropdown
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortBy = e.target.value;
            sortProducts();
        });
    }
    
    // View mode toggle
    document.querySelectorAll('[onclick*="setViewMode"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = e.target.dataset.mode || e.target.getAttribute('onclick').match(/setViewMode\('(\w+)'\)/)?.[1];
            setViewMode(mode);
        });
    });
    
    // Pagination
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    
    if (prevPage) {
        prevPage.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderProducts();
            }
        });
    }
    
    if (nextPage) {
        nextPage.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts();
            }
        });
    }
}

function setCategory(category) {
    selectedCategory = category;
    
    // Update category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        const btnCategory = btn.dataset.category || '';
        if (btnCategory === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    filterProducts();
}

function filterProducts() {
    let filteredProducts = getMockProducts();
    
    // Filter by category
    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(product => 
            product.category === selectedCategory
        );
    }
    
    // Filter by search query
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(searchQuery) ||
            product.description.toLowerCase().includes(searchQuery) ||
            (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchQuery)))
        );
    }
    
    sortProducts(filteredProducts);
}

function sortProducts(filteredProducts = null) {
    const products = filteredProducts || getMockProducts();
    
    switch (sortBy) {
        case 'price-asc':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            products.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'oldest':
            products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'popular':
            // Mock popularity based on IDs
            products.sort((a, b) => b.id - a.id);
            break;
    }
    
    currentProducts = products;
    renderProducts();
}

function setViewMode(mode) {
    viewMode = mode;
    
    // Update view mode buttons
    document.querySelectorAll('[onclick*="setViewMode"]').forEach(btn => {
        if (btn.dataset.mode === mode || btn.getAttribute('onclick').includes(`'${mode}'`)) {
            btn.classList.add('bg-blue-500', 'text-white');
            btn.classList.remove('bg-white', 'text-gray-700');
        } else {
            btn.classList.add('bg-white', 'text-gray-700');
            btn.classList.remove('bg-blue-500', 'text-white');
        }
    });
    
    renderProducts();
}

function updatePagination() {
    const totalProducts = currentProducts.length;
    totalPages = Math.ceil(totalProducts / 12); // 12 products per page
    
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
        
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
    }
    
    if (pageNumbers && totalPages > 1) {
        let paginationHTML = '';
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button onclick="goToPage(${i})" 
                        class="px-3 py-2 text-sm ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} border border-gray-300 rounded-md hover:bg-gray-50">
                    ${i}
                </button>
            `;
        }
        
        pageNumbers.innerHTML = paginationHTML;
    }
}

function goToPage(page) {
    currentPage = page;
    renderProducts();
}

function clearFilters() {
    selectedCategory = '';
    searchQuery = '';
    
    // Reset search input
    const searchInput = document.getElementById('heroSearchInput');
    if (searchInput) searchInput.value = '';
    
    // Reset category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    filterProducts();
}

function updateStats() {
    // Update wishlist count
    updateWishlistCount();
    
    // Update cart count  
    updateCartCount();
}

function updateWishlistCount() {
    const countElement = document.getElementById('wishlistCount');
    if (countElement) {
        countElement.textContent = wishlist.length;
    }
}

function updateCartCount() {
    const countElement = document.getElementById('cartCount');
    if (countElement) {
        countElement.textContent = cart.length;
    }
}

function loadWishlist() {
    try {
        const savedWishlist = localStorage.getItem('profileSellerWishlist');
        wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (e) {
        wishlist = [];
    }
}

function saveWishlist() {
    try {
        localStorage.setItem('profileSellerWishlist', JSON.stringify(wishlist));
    } catch (e) {
        console.error('Error saving wishlist:', e);
    }
}

function loadCart() {
    try {
        const savedCart = localStorage.getItem('profileSellerCart');
        cart = savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
        cart = [];
    }
}

function saveCart() {
    try {
        localStorage.setItem('profileSellerCart', JSON.stringify(cart));
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

// Global functions for HTML onclick handlers
window.viewProduct = viewProduct;
window.closeProductModal = closeProductModal;
window.toggleWishlistItem = toggleWishlistItem;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.purchaseProduct = purchaseProduct;
window.setCategory = setCategory;
window.setViewMode = setViewMode;
window.clearFilters = clearFilters;
window.goToPage = goToPage;
window.logout = logout;
