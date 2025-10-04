const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend server is working!',
        timestamp: new Date().toISOString(),
        status: 'OK'
    });
});

// Mock auth endpoints for testing
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    console.log('🔐 Login attempt:', { email, password });
    
    // Mock demo accounts
    if (email === 'admin@profile-seller.com' && password === 'admin123') {
        res.json({
            message: 'Đăng nhập thành công',
            user: {
                id: '507f1f77bcf86cd799439011',
                email: 'admin@profile-seller.com',
                name: 'Admin User',
                role: 'admin'
            },
            token: 'mock_token_admin_' + Date.now()
        });
    } else if (email === 'user@profile-seller.com' && password === 'user123') {
        res.json({
            message: 'Đăng nhập thành công',
            user: {
                id: '507f1f77bcf86cd799439012',
                email: 'user@profile-seller.com',
                name: 'Regular User',
                role: 'user'
            },
            token: 'mock_token_user_' + Date.now()
        });
    } else {
        res.status(401).json({
            error: 'Email hoặc password không đúng'
        });
    }
});

app.post('/api/auth/register', (req, res) => {
    console.log('📝 Register attempt:', req.body);
    res.json({
        message: 'Đăng ký thành công',
        user: {
            id: '507f1f77bcf86cd799439013',
            name: req.body.name,
            email: req.body.email,
            role: req.body.role || 'user'
        }
    });
});

app.get('/api/auth/profile', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    console.log('👤 Profile request:', token);
    
    // Mock user based on token
    if (token.includes('admin')) {
        res.json({
            user: {
                id: '507f1f77bcf86cd799439011',
                name: 'Admin User',
                email: 'admin@profile-seller.com',
                role: 'admin'
            }
        });
    } else if (token.includes('user')) {
        res.json({
            user: {
                id: '507f1f77bcf86cd799439012',
                name: 'Regular User',
                email: 'user@profile-seller.com',
                role: 'user'
            }
        });
    } else {
        res.status(401).json({
            error: 'Token không hợp lệ'
        });
    }
});

// Mock products endpoints
app.get('/api/profiles', (req, res) => {
    const mockProducts = [
        {
            id: '1',
            title: 'Modern Website Design',
            description: 'Thiết kế website hiện đại với responsive design',
            price: 1500000,
            status: 'active',
            category: 'design',
            tags: ['web', 'design', 'responsive'],
            sellerId: '507f1f77bcf86cd799439011',
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            title: 'E-commerce App Development',
            description: 'Ứng dụng mua sắm trực tuyến với đầy đủ tính năng',
            price: 5000000,
            status: 'active',
            category: 'development',
            tags: ['react', 'nodejs', 'mongodb'],
            sellerId: '507f1f77bcf86cd799439011',
            createdAt: new Date().toISOString()
        },
        {
            id: '3',
            title: 'Social Media Marketing',
            description: 'Chiến lược marketing trên các nền tảng mạng xã hội',
            price: 3000000,
            status: 'active',
            category: 'marketing',
            tags: ['facebook', 'instagram', 'marketing'],
            sellerId: '507f1f77bcf86cd799439012',
            createdAt: new Date().toISOString()
        }
    ];
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const total = mockProducts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = mockProducts.slice(startIndex, endIndex);
    
    res.json({
        profiles: paginatedProducts,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

// Mock stats endpoints
app.get('/api/profiles/stats/overview', (req, res) => {
    res.json({
        total: 3,
        activeCount: 3,
        status: {
            active: 3,
            inactive: 0,
            deleted: 0
        },
        categories: {
            design: 1,
            development: 1,
            marketing: 1
        },
        revenue: []
    });
});

app.get('/api/orders/stats/overview', (req, res) => {
    res.json({
        total: 5,
        totalRevenue: 12000000,
        status: {
            pending: 2,
            completed: 3
        },
        revenue: [
            { _id: 'status1', count: 2, amount: 5000000 },
            { _id: 'status2', count: 3, amount: 7000000 }
        ],
        monthly: []
    });
});

app.get('/api/users/stats/overview', (req, res) => {
    res.json({
        total: 10,
        roles: {
            admin: 1,
            user: 9
        },
        status: {
            active: 10,
            inactive: 0
        },
        monthly: []
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: {
            connected: true,
            collections: 4,
            stats: {
                collections: 4,
                dataSize: 1024,
                indexSize: 512,
                storageSize: 2048
            }
        },
        server: {
            port: 3000,
            environment: 'development'
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n🚀 Mock Backend Server đã khởi động!');
    console.log('📡 Server Info:');
    console.log(`   🌐 URL: http://localhost:${PORT}`);
    console.log(`   📡 Health: http://localhost:${PORT}/api/health`);
    console.log(`   🔐 Auth: http://localhost:${PORT}/api/auth/login`);
    console.log(`   🛍️ Products: http://localhost:${PORT}/api/profiles`);
    console.log(`   ⚙️ Environment: development`);
    console.log(`   🕐 Started: ${new Date().toISOString()}`);
    console.log('\n📝 Demo Accounts:');
    console.log('   👑 Admin: admin@profile-seller.com / admin123');
    console.log('   👤 User:  user@profile-seller.com / user123');
});

// Error handling
app.use((err, req, res, next) => {
    console.error('🚨 Server Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});
