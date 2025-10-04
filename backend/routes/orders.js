const express = require('express');
const router = express.Router();
const databaseManager = require('../database');

// Middleware để log requests
router.use((req, res, next) => {
    console.log(`🛒 Orders route: ${req.method} ${req.url}`);
    next();
});

// GET /api/orders - Lấy danh sách orders
router.get('/', async (req, res) => {
    try {
        const db = databaseManager.db;
        const ordersCollection = db.collection('orders');
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status || '';
        const buyerId = req.query.buyerId || '';
        const sellerId = req.query.sellerId || '';
        
        // Xây dựng filter
        const filter = {};
        if (status) {
            filter.status = status;
        }
        if (buyerId) {
            filter.buyerId = require('mongodb').ObjectId(buyerId);
        }
        if (sellerId) {
            filter.sellerId = require('mongodb').ObjectId(sellerId);
        }
        
        // Đếm tổng số documents
        const total = await ordersCollection.countDocuments(filter);
        
        // Lấy danh sách orders với pagination
        const orders = await ordersCollection
            .find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();
        
        // Lấy thêm thông tin users và profiles
        const enrichedOrders = await Promise.all(orders.map(async (order) => {
            const [buyer, seller, profile] = await Promise.all([
                db.collection('users').findOne({ _id: order.buyerId }),
                db.collection('users').findOne({ _id: order.sellerId }),
                db.collection('profiles').findOne({ _id: order.profileId })
            ]);
            
            return {
                id: order._id,
                buyerId: order.buyerId,
                sellerId: order.sellerId,
                profileId: order.profileId,
                buyer: buyer ? { name: buyer.name, email: buyer.email } : null,
                seller: seller ? { name: seller.name, email: seller.email } : null,
                profile: profile ? { title: profile.title, price: profile.price } : null,
                amount: order.amount,
                status: order.status,
                paymentMethod: order.paymentMethod,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            };
        }));
        
        res.json({
            orders: enrichedOrders,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
        
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            error: 'Lỗi khi lấy danh sách orders',
            message: error.message
        });
    }
});

// GET /api/orders/:id - Lấy thông tin order theo ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const db = databaseManager.db;
        const ordersCollection = db.collection('orders');
        
        const order = await ordersCollection.findOne({
            _id: require('mongodb').ObjectId(id)
        });
        
        if (!order) {
            return res.status(404).json({
                error: 'Không tìm thấy order'
            });
        }
        
        // Lấy thêm thông tin liên quan
        const [buyer, seller, profile] = await Promise.all([
            db.collection('users').findOne({ _id: order.buyerId }),
            db.collection('users').findOne({ _id: order.sellerId }),
            db.collection('profiles').findOne({ _id: order.profileId })
        ]);
        
        res.json({
            order: {
                id: order._id,
                buyerId: order.buyerId,
                sellerId: order.sellerId,
                profileId: order.profileId,
                buyer: buyer ? { 
                    id: buyer._id, 
                    name: buyer.name, 
                    email: buyer.email 
                } : null,
                seller: seller ? { 
                    id: seller._id, 
                    name: seller.name, 
                    email: seller.email 
                } : null,
                profile: profile ? { 
                    id: profile._id, 
                    title: profile.title, 
                    description: profile.description,
                    price: profile.price 
                } : null,
                amount: order.amount,
                status: order.status,
                paymentMethod: order.paymentMethod,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            }
        });
        
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            error: 'Lỗi khi lấy thông tin order',
            message: error.message
        });
    }
});

// POST /api/orders - Tạo order mới
router.post('/', async (req, res) => {
    try {
        const { 
            buyerId, 
            sellerId, 
            profileId, 
            paymentMethod 
        } = req.body;
        
        if (!buyerId || !sellerId || !profileId) {
            return res.status(400).json({
                error: 'buyerId, sellerId và profileId là bắt buộc'
            });
        }
        
        const db = databaseManager.db;
        const ordersCollection = db.collection('orders');
        const profilesCollection = db.collection('profiles');
        
        // Lấy thông tin profile để tính tiền
        const profile = await profilesCollection.findOne({
            _id: require('mongodb').ObjectId(profileId)
        });
        
        if (!profile) {
            return res.status(404).json({
                error: 'Không tìm thấy profile'
            });
        }
        
        if (profile.status !== 'active') {
            return res.status(400).json({
                error: 'Profile không khả dụng để mua'
            });
        }
        
        const newOrder = {
            buyerId: require('mongodb').ObjectId(buyerId),
            sellerId: require('mongodb').ObjectId(sellerId),
            profileId: require('mongodb').ObjectId(profileId),
            amount: profile.price,
            status: 'pending',
            paymentMethod: paymentMethod || 'credit_card',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await ordersCollection.insertOne(newOrder);
        
        res.status(201).json({
            message: 'Tạo order thành công',
            order: {
                id: result.insertedId,
                buyerId: newOrder.buyerId,
                sellerId: newOrder.sellerId,
                profileId: newOrder.profileId,
                amount: newOrder.amount,
                status: newOrder.status,
                paymentMethod: newOrder.paymentMethod
            }
        });
        
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            error: 'Lỗi khi tạo order',
            message: error.message
        });
    }
});

// PUT /api/orders/:id - Cập nhật trạng thái order
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paymentMethod } = req.body;
        
        const db = databaseManager.db;
        const ordersCollection = db.collection('orders');
        
        const updateData = {
            updatedAt: new Date()
        };
        
        if (status !== undefined) {
            updateData.status = status;
        }
        if (paymentMethod !== undefined) {
            updateData.paymentMethod = paymentMethod;
        }
        
        const result = await ordersCollection.updateOne(
            { _id: require('mongodb').ObjectId(id) },
            { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({
                error: 'Không tìm thấy order để cập nhật'
            });
        }
        
        // Lấy order đã cập nhật
        const updatedOrder = await ordersCollection.findOne({
            _id: require('mongodb').ObjectId(id)
        });
        
        res.json({
            message: 'Cập nhật order thành công',
            order: {
                id: updatedOrder._id,
                buyerId: updatedOrder.buyerId,
                sellerId: updatedOrder.sellerId,
                profileId: updatedOrder.profileId,
                amount: updatedOrder.amount,
                status: updatedOrder.status,
                paymentMethod: updatedOrder.paymentMethod
            }
        });
        
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({
            error: 'Lỗi khi cập nhật order',
            message: error.message
        });
    }
});

// GET /api/orders/stats/overview - Thống kê orders
router.get('/stats/overview', async (req, res) => {
    try {
        const db = databaseManager.db;
        const ordersCollection = db.collection('orders');
        
        // Đếm orders theo status
        const statusStats = await ordersCollection.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]).toArray();
        
        // Tính tổng doanh thu
        const revenueStats = await ordersCollection.aggregate([
            { $group: { 
                _id: '$status', 
                totalAmount: { $sum: '$amount' },
                count: { $sum: 1 }
            }}
        ]).toArray();
        
        // Orders theo tháng
        const monthlyStats = await ordersCollection.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 12 }
        ]).toArray();
        
        const total = await ordersCollection.countDocuments();
        const totalRevenue = await ordersCollection.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]).toArray();
        
        res.json({
            total,
            totalRevenue: totalRevenue[0]?.total || 0,
            status: statusStats.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {}),
            revenue: revenueStats.reduce((acc, item) => {
                acc[item._id] = {
                    count: item.count,
                    amount: item.totalAmount
                };
                return acc;
            }, {}),
            monthly: monthlyStats.map(item => ({
                month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
                count: item.count,
                revenue: item.revenue
            }))
        });
        
    } catch (error) {
        console.error('Get orders stats error:', error);
        res.status(500).json({
            error: 'Lỗi khi lấy thống kê orders',
            message: error.message
        });
    }
});

module.exports = router;

