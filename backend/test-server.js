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
                name: 'Portfolio Manager',
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
            token: 'mock_token_dev_' + Date.now()
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

// Mock portfolio endpoints
app.get('/api/profiles', (req, res) => {
    const mockProjects = [
        {
            id: '1',
            title: 'Food Delivery Mobile App',
            description: 'Ứng dụng đặt đồ ăn online với React Native và Firebase',
            status: 'completed',
            category: 'mobile',
            tags: ['react-native', 'firebase', 'android', 'ios'],
            techStack: ['React Native', 'Firebase', 'Redux', 'Google Maps'],
            demoUrls: ['github.com/user/food-app', 'expo.dev/food-delivery'],
            rating: 4.8,
            downloads: 1200,
            developerId: '507f1f77bcf86cd799439011',
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            title: 'AI ChatBot Web App',
            description: 'Website chat với AI tích hợp OpenAI GPT và socket.io',
            status: 'active',
            category: 'web',
            tags: ['ai', 'chatbot', 'openai', 'nodejs'],
            techStack: ['React', 'Node.js', 'OpenAI API', 'Socket.io'],
            demoUrls: ['github.com/user/ai-chat', 'ai-chat.vercel.app'],
            rating: 4.9,
            users: 560,
            developerId: '507f1f77bcf86cd799439011',
            createdAt: new Date().toISOString()
        },
        {
            id: '3',
            title: 'Đồ án IoT Smart Home',
            description: 'Hệ thống nhà thông minh với Arduino và web dashboard',
            status: 'prototype',
            category: 'iot',
            tags: ['arduino', 'iot', 'smart-home', 'dashboard'],
            techStack: ['Arduino', 'ESP32', 'React', 'WebSocket'],
            demoUrls: ['github.com/user/smart-home', 'smart-home.demo.com'],
            rating: 4.7,
            views: 890,
            developerId: '507f1f77bcf86cd799439012',
            createdAt: new Date().toISOString()
        }
    ];
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const total = mockProjects.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProjects = mockProjects.slice(startIndex, endIndex);
    
    res.json({
        projects: paginatedProjects,
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
    console.log('\n🚀 Portfolio Hub Backend Server đã khởi động!');
    console.log('📡 Server Info:');
    console.log(`   🌐 URL: http://localhost:${PORT}`);
    console.log(`   📡 Health: http://localhost:${PORT}/api/health`);
    console.log(`   🔐 Auth: http://localhost:${PORT}/api/auth/login`);
    console.log(`   📱 Portfolio: http://localhost:${PORT}/api/profiles`);
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
