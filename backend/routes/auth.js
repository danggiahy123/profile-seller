const express = require('express');
const router = express.Router();
const databaseManager = require('../database');

// Middleware để log requests
router.use((req, res, next) => {
    console.log(`🔐 Auth route: ${req.method} ${req.url}`);
    next();
});

// POST /api/auth/login - Đăng nhập
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email và password là bắt buộc'
            });
        }
        
        const db = databaseManager.db;
        const usersCollection = db.collection('users');
        
        // Tìm user trong MongoDB
        const user = await usersCollection.findOne({ 
            email: email,
            // Trong thực tế sẽ hash password
            password: password // Tạm thời để plain text
        });
        
        if (!user) {
            return res.status(401).json({
                error: 'Email hoặc password không đúng'
            });
        }
        
        // Tạo token (đơn giản)
        const token = `token_${user._id}_${Date.now()}`;
        
        res.json({
            message: 'Đăng nhập thành công',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role || 'user'
            },
            token: token
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Lỗi server khi đăng nhập',
            message: error.message
        });
    }
});

// POST /api/auth/register - Đăng ký
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'Tên, email và password là bắt buộc'
            });
        }
        
        const db = databaseManager.db;
        const usersCollection = db.collection('users');
        
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                error: 'Email đã được sử dụng'
            });
        }
        
        // Tạo user mới
        const newUser = {
            name,
            email,
            password, // Trong thực tế sẽ hash
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true
        };
        
        const result = await usersCollection.insertOne(newUser);
        
        res.status(201).json({
            message: 'Đăng ký thành công',
            user: {
                id: result.insertedId,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
        
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            error: 'Lỗi server khi đăng ký',
            message: error.message
        });
    }
});

// POST /api/auth/logout - Đăng xuất
router.post('/logout', (req, res) => {
    res.json({
        message: 'Đăng xuất thành công'
    });
});

// GET /api/auth/profile - Lấy thông tin user
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                error: 'Token không hợp lệ'
            });
        }
        
        // Đơn giản hóa: tìm theo userId trong token
        const userId = token.split('_')[1];
        
        const db = databaseManager.db;
        const usersCollection = db.collection('users');
        
        const user = await usersCollection.findOne({ 
            _id: require('mongodb').ObjectId(userId) 
        });
        
        if (!user) {
            return res.status(404).json({
                error: 'Không tìm thấy user'
            });
        }
        
        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
        
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            error: 'Lỗi server khi lấy thông tin user',
            message: error.message
        });
    }
});

module.exports = router;

