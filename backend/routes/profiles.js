const express = require('express');
const router = express.Router();
const databaseManager = require('../database');

// Middleware để log requests
router.use((req, res, next) => {
    console.log(`🆔 Profiles route: ${req.method} ${req.url}`);
    next();
});

// GET /api/profiles - Lấy danh sách profiles
router.get('/', async (req, res) => {
    try {
        const db = databaseManager.db;
        const profilesCollection = db.collection('profiles');
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const status = req.query.status || '';
        const category = req.query.category || '';
        
        // Xây dựng filter
        const filter = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }
        if (status) {
            filter.status = status;
        }
        if (category) {
            filter.category = category;
        }
        
        // Đếm tổng số documents
        const total = await profilesCollection.countDocuments(filter);
        
        // Lấy danh sách profiles với pagination
        const profiles = await profilesCollection
            .find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();
        
        res.json({
            profiles: profiles.map(profile => ({
                id: profile._id,
                title: profile.title,
                description: profile.description,
                price: profile.price,
                status: profile.status,
                category: profile.category,
                tags: profile.tags,
                sellerId: profile.sellerId,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
        
    } catch (error) {
        console.error('Get profiles error:', error);
        res.status(500).json({
            error: 'Lỗi khi lấy danh sách profiles',
            message: error.message
        });
    }
});

// GET /api/profiles/:id - Lấy thông tin profile theo ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const db = databaseManager.db;
        const profilesCollection = db.collection('profiles');
        
        const profile = await profilesCollection.findOne({
            _id: require('mongodb').ObjectId(id)
        });
        
        if (!profile) {
            return res.status(404).json({
                error: 'Không tìm thấy profile'
            });
        }
        
        res.json({
            profile: {
                id: profile._id,
                title: profile.title,
                description: profile.description,
                price: profile.price,
                status: profile.status,
                category: profile.category,
                tags: profile.tags,
                sellerId: profile.sellerId,
                content: profile.content,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt
            }
        });
        
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            error: 'Lỗi khi lấy thông tin profile',
            message: error.message
        });
    }
});

// POST /api/profiles - Tạo profile mới
router.post('/', async (req, res) => {
    try {
        const { 
            title, 
            description, 
            price, 
            category, 
            tags, 
            sellerId, 
            content 
        } = req.body;
        
        if (!title || !description || !price || !sellerId) {
            return res.status(400).json({
                error: 'Title, description, price và sellerId là bắt buộc'
            });
        }
        
        const db = databaseManager.db;
        const profilesCollection = db.collection('profiles');
        
        const newProfile = {
            title,
            description,
            price: parseFloat(price),
            status: 'active',
            category: category || 'general',
            tags: tags || [],
            sellerId: require('mongodb').ObjectId(sellerId),
            content: content || '',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await profilesCollection.insertOne(newProfile);
        
        res.status(201).json({
            message: 'Tạo profile thành công',
            profile: {
                id: result.insertedId,
                title: newProfile.title,
                description: newProfile.description,
                price: newProfile.price,
                status: newProfile.status,
                category: newProfile.category,
                tags: newProfile.tags,
                sellerId: newProfile.sellerId
            }
        });
        
    } catch (error) {
        console.error('Create profile error:', error);
        res.status(500).json({
            error: 'Lỗi khi tạo profile',
            message: error.message
        });
    }
});

// PUT /api/profiles/:id - Cập nhật profile
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            title, 
            description, 
            price, 
            status, 
            category, 
            tags, 
            content 
        } = req.body;
        
        const db = databaseManager.db;
        const profilesCollection = db.collection('profiles');
        
        const updateData = {
            updatedAt: new Date()
        };
        
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (status !== undefined) updateData.status = status;
        if (category !== undefined) updateData.category = category;
        if (tags !== undefined) updateData.tags = tags;
        if (content !== undefined) updateData.content = content;
        
        const result = await profilesCollection.updateOne(
            { _id: require('mongodb').ObjectId(id) },
            { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({
                error: 'Không tìm thấy profile để cập nhật'
            });
        }
        
        // Lấy profile đã cập nhật
        const updatedProfile = await profilesCollection.findOne({
            _id: require('mongodb').ObjectId(id)
        });
        
        res.json({
            message: 'Cập nhật profile thành công',
            profile: {
                id: updatedProfile._id,
                title: updatedProfile.title,
                description: updatedProfile.description,
                price: updatedProfile.price,
                status: updatedProfile.status,
                category: updatedProfile.category,
                tags: updatedProfile.tags,
                sellerId: updatedProfile.sellerId
            }
        });
        
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            error: 'Lỗi khi cập nhật profile',
            message: error.message
        });
    }
});

// DELETE /api/profiles/:id - Xóa profile
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const db = databaseManager.db;
        const profilesCollection = db.collection('profiles');
        
        const result = await profilesCollection.updateOne(
            { _id: require('mongodb').ObjectId(id) },
            { $set: { 
                status: 'deleted',
                deletedAt: new Date(),
                updatedAt: new Date()
            }}
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({
                error: 'Không tìm thấy profile để xóa'
            });
        }
        
        res.json({
            message: 'Xóa profile thành công (soft delete)'
        });
        
    } catch (error) {
        console.error('Delete profile error:', error);
        res.status(500).json({
            error: 'Lỗi khi xóa profile',
            message: error.message
        });
    }
});

// GET /api/profiles/stats/overview - Thống kê profiles
router.get('/stats/overview', async (req, res) => {
    try {
        const db = databaseManager.db;
        const profilesCollection = db.collection('profiles');
        
        // Đếm profiles theo status
        const statusStats = await profilesCollection.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]).toArray();
        
        // Đếm profiles theo category
        const categoryStats = await profilesCollection.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]).toArray();
        
        // Tính tổng doanh thu
        const revenueStats = await profilesCollection.aggregate([
            { $group: { 
                _id: '$status', 
                totalRevenue: { $sum: '$price' },
                avgPrice: { $avg: '$price' },
                count: { $sum: 1 }
            }}
        ]).toArray();
        
        const total = await profilesCollection.countDocuments();
        const activeCount = await profilesCollection.countDocuments({ status: 'active' });
        
        res.json({
            total,
            activeCount,
            status: statusStats.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {}),
            categories: categoryStats.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {}),
            revenue: revenueStats
        });
        
    } catch (error) {
        console.error('Get profiles stats error:', error);
        res.status(500).json({
            error: 'Lỗi khi lấy thống kê profiles',
            message: error.message
        });
    }
});

module.exports = router;

