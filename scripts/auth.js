// Authentication JavaScript

// API Base URL
const API_BASE = 'http://localhost:3000/api';

// DOM Elements
let loginForm, emailInput, passwordInput, loginBtn, errorMessage, successMessage, loadingOverlay;

document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    // Get DOM elements
    loginForm = document.getElementById('loginForm');
    emailInput = document.getElementById('email');
    passwordInput = document.getElementById('password');
    loginBtn = document.getElementById('loginBtn');
    errorMessage = document.getElementById('errorMessage');
    successMessage = document.getElementById('successMessage');
    loadingOverlay = document.getElementById('loadingOverlay');
    togglePasswordBtn = document.getElementById('togglePassword');

    // Event listeners (with null checks)
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', togglePassword);
    }

    // Initialize if already logged in
    checkAuthStatus();

    console.log('🔐 Authentication system initialized');
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        showError('Vui lòng nhập đầy đủ email và mật khẩu');
        return;
    }

    showLoading(true);
    hideMessages();

    try {
        console.log('🔄 Attempting login...');
        
        // Call login API
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Đăng nhập thất bại');
        }

        // Store auth data
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        localStorage.setItem('login_time', Date.now().toString());

        console.log('✅ Login successful:', data.user);

        showSuccess('Đăng nhập thành công! Đang chuyển hướng...');

        // Redirect based on user role
        setTimeout(() => {
            if (data.user.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'products.html';
            }
        }, 1500);

    } catch (error) {
        console.error('❌ Login error:', error);
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

// Toggle password visibility
function togglePassword() {
    if (!passwordInput || !togglePasswordBtn) return;
    
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    const icon = togglePasswordBtn.querySelector('i');
    if (icon) {
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    }
}

// Show loading overlay
function showLoading(show) {
    if (!loadingOverlay || !loginBtn) return;
    
    if (show) {
        loadingOverlay.classList.remove('hidden');
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Đang đăng nhập...';
    } else {
        loadingOverlay.classList.add('hidden');
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i>Đăng nhập';
    }
}

// Show error message
function showError(message) {
    if (!errorMessage) return;
    
    errorMessage.querySelector('#errorText').textContent = message;
    errorMessage.classList.remove('hidden');
    if (successMessage) successMessage.classList.add('hidden');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideMessages();
    }, 5000);
}

// Show success message
function showSuccess(message) {
    if (!successMessage) return;
    
    successMessage.querySelector('#successText').textContent = message;
    successMessage.classList.remove('hidden');
}

// Hide all messages
function hideMessages() {
    if (errorMessage) errorMessage.classList.add('hidden');
    if (successMessage) successMessage.classList.add('hidden');
}

// Fill login form with demo credentials
function fillLoginForm(email, password) {
    if (!emailInput || !passwordInput) return;
    
    emailInput.value = email;
    passwordInput.value = password;
    hideMessages();
    
    // Highlight the inputs
    emailInput.classList.add('ring-2', 'ring-teal-500');
    passwordInput.classList.add('ring-2', 'ring-teal-500');
    
    setTimeout(() => {
        emailInput.classList.remove('ring-2', 'ring-teal-500');
        passwordInput.classList.remove('ring-2', 'ring-teal-500');
    }, 2000);
}

// Check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    const loginTime = localStorage.getItem('login_time');

    if (!token || !userData) {
        return false;
    }

    // Check if token is expired (24 hours)
    const tokenAge = Date.now() - parseInt(loginTime);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (tokenAge > maxAge) {
        console.log('🕐 Token expired, clearing auth data');
        clearAuthData();
        return false;
    }

    const user = JSON.parse(userData);
    console.log('✅ User is authenticated:', user);

    // Auto redirect if already logged in
    if (window.location.pathname.includes('login.html')) {
        showSuccess('Bạn đã đăng nhập! Đang chuyển hướng...');
        setTimeout(() => {
            if (user.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'products.html';
            }
        }, 1500);
    }

    return true;
}

// Validate JWT token
async function validateToken() {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        return false;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            clearAuthData();
            return false;
        }

        const data = await response.json();
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        return data.user;
    } catch (error) {
        console.error('❌ Token validation failed:', error);
        clearAuthData();
        return false;
    }
}

// Clear authentication data
function clearAuthData() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('login_time');
}

// Logout function
function logout() {
    const token = localStorage.getItem('auth_token');
    
    // Call logout API if logged in
    if (token) {
        fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).catch(console.error);
    }

    clearAuthData();
    window.location.href = 'login.html';
}

// Get current user data
function getCurrentUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
}

// Check if user is admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// Check if user is authenticated
function isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    return token !== null;
}

// Make authenticated API request
async function apiRequest(url, options = {}) {
    const token = localStorage.getItem('auth_token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401) {
        // Unauthorized - redirect to login
        clearAuthData();
        window.location.href = 'login.html';
        return null;
    }

    return response;
}

// Export functions for global use
window.Auth = {
    isAuthenticated,
    isAdmin,
    getCurrentUser,
    logout,
    validateToken,
    apiRequest,
    clearAuthData
};

// Demo accounts setup (call when page loads)
async function setupDemoAccounts() {
    try {
        console.log('🔄 Setting up demo accounts...');
        
        const adminAccount = {
            name: 'Admin User',
            email: 'admin@profile-seller.com',
            password: 'admin123',
            role: 'admin'
        };

        const userAccount = {
            name: 'Regular User',
            email: 'user@profile-seller.com', 
            password: 'user123',
            role: 'user'
        };

        // Check if accounts exist and create if needed
        await Promise.all([
            createDemoAccount(adminAccount),
            createDemoAccount(userAccount)
        ]);

        console.log('✅ Demo accounts setup complete');
    } catch (error) {
        console.error('❌ Demo accounts setup failed:', error);
    }
}

async function createDemoAccount(accountData) {
    try {
        // Try to register (will fail if exists)
        await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(accountData)
        });
    } catch (error) {
        // Account might already exist, that's ok
        console.log(`ℹ️ Account ${accountData.email} likely already exists`);
    }
}

// Setup demo accounts on page load
setupDemoAccounts();

