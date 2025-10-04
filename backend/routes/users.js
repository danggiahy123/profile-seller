const express = require('express');
const router = express.Router();
const databaseManager = require('../database');

// Middleware để log requests
router.use((req, res, next) => {
    console.log(`👥 Users route: ${req.method} ${req.url}`);
    next();
});

// GET /api/users - Lấy danh sách users
router.get('/', async (req, res) => {
    try {
        const db = databaseManager.db;
        const usersCollection = db.collection('users');
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const role = req.query.role || '';
        
        // Xây dựng filter
        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (role) {
            filter.role = role;
        }
        
        // Đếm tổng số documents
        const total = await usersCollection.countDocuments(filter);
        
        // Lấy danh sách users với pagination
        const users = await usersCollection
            .find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();
        
        res.json({
            users: users.map(user => ({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
        
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            error: 'Lỗi khi lấy danh sách users',
            message: error.message
        });
    }
});

// GET /api/users/:id - Lấy thông tin user theo ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const db = databaseManager.db;
        const usersCollection = db.collection('users');
        
        const user = await usersCollection.findOne({
            _id: require('mongodb').ObjectId(id)
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
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
        
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            error: 'Lỗi khi lấy thông tin user',
            message: error.message
        });
    }
});

// PUT /api/users/:id - Cập nhật user
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, isActive } = req.body;
        
        const db = databaseManager.db;
        const usersCollection = db.collection('users');
        
        const updateData = {
            updatedAt: new Date()
        };
        
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (role !== undefined) updateData.role = role;
        if (isActive !== undefined) updateData.isActive = isActive;
        
        const result = await usersCollection.updateOne(
            { _id: require('mongodb').ObjectId(id) },
            { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({
                error: 'Không tìm thấy user đế cập nhật'
            });
        }
        
        // Lấy user đã cập nhật
        const updatedUser = await usersCollection.findOne({
            _id: require('mongodb').ObjectId(id)
        });
        
        res.json({
            message: 'Cập nhật user thành công',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                isActive: updatedUser.isActive,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            }
        });
        
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            error: 'Lỗi khi cập nhật user',
            message: error.message
        });
    }
});

// DELETE /api/users/:id - Xóa user (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const db = databaseManager.db;
        const usersCollection = db.collection('users');
        
        const result = await usersCollection.updateOne(
            { _id: require('mongodb').ObjectId(id) },
            { $set: { 
                isActive: false,
                deletedAt: new Date(),
                updatedAt: new Date()
            }}
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({
                error: 'Không tìm thấy user để xóa'
            });
        }
        
        res.json({
            message: 'Xóa user thành công (soft delete)'
        });
        
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            error: 'Lỗi khi xóa user',
            message: error.message
        });
    }
});

// GET /api/users/stats - Thống kê users
router.get('/stats/overview', async (req, res) => {
    try {
        const db = databaseManager.db;
        const usersCollection = db.collection('users');
        
        // Đếm users theo role
        const roleStats = await usersCollection.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]).toArray();
        
        // Đếm users active/inactive
        const statusStats = await usersCollection.aggregate([
            { $group: { _id: '$isActive', count: { $sum: 1 } } }
        ]).toArray();
        
        // Đếm users theo tháng (chart data)
        const monthlyStats = await usersCollection.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 12 }
        ]).toArray();
        
        const total = await usersCollection.countDocuments();
        
        res.json({
            total,
            roles: roleStats.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {}),
            status: statusStats.reduce((acc, item) => {
                acc[item._id ? 'active' : 'inactive'] = item.count;
                return acc;
            }, {}),
            monthly: monthlyStats.map(item => ({
                month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
                count: item.count
            }))
        });
        
    } catch (error) {
        console.error('Get users stats error:', error);
        res.status(500).json({
            error: 'Lỗi khi lấy thống kê users',
            message: error.message
        });
    }
});

module.exports = router;
