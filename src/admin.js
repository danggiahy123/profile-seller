// Admin Dashboard JavaScript

let currentProducts = [];
let currentPage = 1;
let totalPages = 1;
let selectedCategory = '';
let selectedStatus = '';
let searchQuery = '';

const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializeAdmin();
});

function checkAuth() {
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    if (!Auth.isAdmin()) {
        showToast('error', 'Không có quyền truy cập', 'Chỉ admin mới được truy cập trang này');
        setTimeout(() => {
            window.location.href = 'products.html';
        }, 2000);
        return;
    }
    
    updateUserInfo();
}

function updateUserInfo() {
    const user = Auth.getCurrentUser();
    if (user) {
        document.getElementById('welcomeText').textContent = `Chào mừng, ${user.name}!`;
        document.getElementById('userEmail').textContent = user.email;
    }
}

function initializeAdmin() {
    setupEventListeners();
    loadStats();
    loadProducts();
}

function setupEventListeners() {
    // Search
    document.getElementById('searchInput').addEventListener('input', debounce(handleSearch, 300));
    
    // Filters
    document.getElementById('categoryFilter').addEventListener('change', handleCategoryFilter);
    document.getElementById('statusFilter').addEventListener('change', handleStatusFilter);
    
    // Table
    document.getElementById('selectAll').addEventListener('change', handleSelectAll);
    
    // Pagination
    document.getElementById('prevPage').addEventListener('click', () => changePage(currentPage - 1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(currentPage + 1));
    
    // Form
    document.getElementById('productForm').addEventListener('submit', handleFormSubmit);
    
    console.log('🔧 Admin event listeners setup complete');
}

async function loadStats() {
    try {
        const [products, orders, users] = await Promise.all([
            fetch(`${API_BASE}/profiles/stats/overview`).then(r => r.json()),
            fetch(`${API_BASE}/orders/stats/overview`).then(r => r.json()),
            fetch(`${API_BASE}/users/stats/overview`).then(r => r.json())
        ]);
        
        document.getElementById('totalProducts').textContent = products.total || 0;
        document.getElementById('totalOrders').textContent = orders.total || 0;
        document.getElementById('totalRevenue').textContent = formatCurrency(orders.totalRevenue || 0);
        document.getElementById('totalUsers').textContent = users.total || 0;
        
    } catch (error) {
        console.error('❌ Stats loading error:', error);
    }
}

async function loadProducts(page = 1) {
    showLoading(true);
    
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: '10'
        });
        
        if (selectedCategory) params.append('category', selectedCategory);
        if (selectedStatus) params.append('status', selectedStatus);
        if (searchQuery) params.append('search', searchQuery);
        
        const response = await fetch(`${API_BASE}/profiles?${params}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Lỗi khi tải sản phẩm');
        }
        
        currentProducts = data.profiles || [];
        totalPages = data.pagination?.pages || 1;
        
        renderProductsTable();
        updatePagination(data.pagination);
        
    } catch (error) {
        console.error('❌ Load products error:', error);
        showTableState('error', error.message);
    } finally {
        showLoading(false);
    }
}

function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    const productsTable = document.querySelector('.overflow-x-auto');
    const emptyState = document.getElementById('emptyState');
    
    if (currentProducts.length === 0) {
        productsTable.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    productsTable.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    tbody.innerHTML = currentProducts.map(product => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <input type="checkbox" class="product-checkbox rounded" data-id="${product.id}">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                        <i class="fas fa-image text-gray-400"></i>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-gray-900">${product.title}</div>
                        <div class="text-sm text-gray-500 truncate max-w-xs">${product.description}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${formatCurrency(product.price)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(product.category)}">
                    ${getCategoryName(product.category)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(product.status)}">
                    ${getStatusName(product.status)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${product.sellerId ? 'Loading...' : 'N/A'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${formatDate(product.createdAt)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                    <button onclick="editProduct('${product.id}')" class="text-indigo-600 hover:text-indigo-900">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteProduct('${product.id}')" class="text-red-600 hover:text-red-900">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function updatePagination(pagination) {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    const paginationInfo = document.getElementById('paginationInfo');
    
    // Update info
    paginationInfo.textContent = `${((pagination.page - 1) * pagination.limit) + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)} của ${pagination.total} sản phẩm`;
    
    // Update buttons
    prevBtn.disabled = pagination.page <= 1;
    nextBtn.disabled = pagination.page >= pagination.pages;
    
    // Update page numbers
    pageNumbers.innerHTML = '';
    const startPage = Math.max(1, pagination.page - 2);
    const endPage = Math.min(pagination.pages, pagination.page + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = `px-3 py-2 text-sm border rounded-lg mr-1 ${
            i === pagination.page 
                ? 'bg-teal-500 text-white border-teal-500' 
                : 'border-gray-300 hover:bg-gray-50'
        }`;
        button.onclick = () => changePage(i);
        pageNumbers.appendChild(button);
    }
}

function changePage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    loadProducts(page);
}

function handleSearch(event) {
    searchQuery = event.target.value.trim();
    currentPage = 1;
    loadProducts(1);
}

function handleCategoryFilter(event) {
    selectedCategory = event.target.value;
    currentPage = 1;
    loadProducts(1);
}

function handleStatusFilter(event) {
    selectedStatus = event.target.value;
    currentPage = 1;
    loadProducts(1);
}

function handleSelectAll(event) {
    const checkboxes = document.querySelectorAll('.product-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = event.target.checked;
    });
}

function showLoading(show) {
    const loading = document.getElementById('loadingState');
    const table = document.querySelector('.overflow-x-auto');
    
    if (show) {
        loading.classList.remove('hidden');
        table.classList.add('hidden');
    } else {
        loading.classList.add('hidden');
        table.classList.remove('hidden');
    }
}

function showTableState(type, message) {
    // Hide all states
    document.querySelector('.overflow-x-auto').classList.add('hidden');
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('emptyState').classList.add('hidden');
    
    if (type === 'error') {
        showToast('error', 'Lỗi', message);
    }
}

function openProductModal(product = null) {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const submitText = document.getElementById('submitText');
    
    if (product) {
        // Edit mode
        modalTitle.textContent = 'Chỉnh sửa sản phẩm';
        submitText.textContent = 'Cập nhật sản phẩm';
        
        document.getElementById('productId').value = product.id;
        document.getElementById('productTitle').value = product.title;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productTags').value = product.tags.join(', ');
        document.getElementById('productContent').value = product.content || '';
    } else {
        // Create mode
        modalTitle.textContent = 'Thêm sản phẩm mới';
        submitText.textContent = 'Tạo sản phẩm';
        
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
    }
    
    modal.classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('productModal').classList.add('hidden');
    document.getElementById('productForm').reset();
}

function editProduct(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if (product) {
        openProductModal(product);
    }
}

async function deleteProduct(productId) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    
    try {
        const response = await Auth.apiRequest(`${API_BASE}/profiles/${productId}`, {
            method: 'DELETE'
        });
        
        if (!response || !response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Lỗi khi xóa sản phẩm');
        }
        
        showToast('success', 'Thành công', 'Đã xóa sản phẩm thành công');
        loadProducts(currentPage);
        
    } catch (error) {
        console.error('❌ Delete error:', error);
        showToast('error', 'Lỗi', error.message);
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const productData = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        category: formData.get('category'),
        tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
        content: formData.get('content'),
        sellerId: Auth.getCurrentUser()?.id || 'current_user_id'
    };
    
    const productId = document.getElementById('productId').value;
    const isEditing = !!productId;
    
    try {
        const url = isEditing ? `${API_BASE}/profiles/${productId}` : `${API_BASE}/profiles`;
        const method = isEditing ? 'PUT' : 'POST';
        
        const response = await Auth.apiRequest(url, {
            method: method,
            body: JSON.stringify(productData)
        });
        
        if (!response || !response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Lỗi khi lưu sản phẩm');
        }
        
        showToast('success', 'Thành công', 
            isEditing ? 'Đã cập nhật sản phẩm thành công' : 'Đã tạo sản phẩm thành công');
        
        closeProductModal();
        loadProducts(currentPage);
        
    } catch (error) {
        console.error('❌ Save error:', error);
        showToast('error', 'Lỗi', error.message);
    }
}

function goToProducts() {
    window.location.href = 'products.html';
}

function logout() {
    Auth.logout();
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN');
}

function getCategoryColor(category) {
    const colors = {
        'design': 'bg-purple-100 text-purple-800',
        'development': 'bg-blue-100 text-blue-v800',
        'marketing': 'bg-green-100 text-green-800',
        'photo': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
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

function getStatusColor(status) {
    const colors = {
        'active': 'bg-green-100 text-green-800',
        'inactive': 'bg-yellow-100 text-yellow-800',
        'deleted': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

function getStatusName(status) {
    const names = {
        'active': 'Hoạt động',
        'inactive': 'Không hoạt động',
        'deleted': 'Đã xóa'
    };
    return names[status] || status;
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

console.log('🔧 Admin dashboard initialized');

