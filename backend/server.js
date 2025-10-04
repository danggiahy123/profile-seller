const express = require('express');
const cors = require('cors');
const config = require('./config');
const databaseManager = require('./database');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const profileRoutes = require('./routes/profiles');
const orderRoutes = require('./routes/orders');

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        const dbStats = await databaseManager.getStats();
        const collections = await databaseManager.getCollections();
        
        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            database: {
                connected: true,
                collections: collections.length,
                stats: dbStats
            },
            server: {
                port: config.server.port,
                environment: config.server.env
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// MongoDB info endpoint
app.get('/api/database', async (req, res) => {
    try {
        const collections = await databaseManager.getCollections();
        const stats = await databaseManager.getStats();
        
        res.json({
            connection: config.mongodb,
            collections: collections,
            stats: stats,
            mongoose: {
                readyState: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected'
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// Test endpoint
app.get('/api/test', async (req, res) => {
    try {
        const db = databaseManager.db;
        if (!db) {
            throw new Error('Database not connected');
        }
        
        // Test basic operations
        const testCollection = db.collection('test_connection');
        const testDoc = {
            message: 'Hello MongoDB!',
            timestamp: new Date(),
            test: true
        };
        
        // Insert test document
        const insertResult = await testCollection.insertOne(testDoc);
        console.log('✅ Test document inserted:', insertResult.insertedId);
        
        // Find test document
        const foundDoc = await testCollection.findOne({ _id: insertResult.insertedId });
        
        // Delete test document
        await testCollection.deleteOne({ _id: insertResult.insertedId });
        console.log('✅ Test document deleted');
        
        res.json({
            message: 'MongoDB test successful!',
            operation: 'CRUD Test',
            inserted_id: insertResult.insertedId,
            found_document: foundDoc,
            database: {
                name: config.mongodb.database,
                collections_count: await db.listCollections().toArray().then(cols => cols.length)
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'MongoDB test failed',
            message: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('🚨 Server Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

// Start server
async function startServer() {
    try {
        // Connect to MongoDB
        await databaseManager.connectMongoose();
        
        // Get stats and collections
        await databaseManager.getStats();
        await databaseManager.getCollections();
        
        // Start Express server
        const PORT = config.server.port;
        app.listen(PORT, () => {
            console.log('\n🚀 Server đã khởi động thành công!');
            console.log('📊 Server Info:');
            console.log(`   🌐 URL: http://localhost:${PORT}`);
            console.log(`   📡 Health: http://localhost:${PORT}/api/health`);
            console.log(`   🗃️ Database: http://localhost:${PORT}/api/database`);
            console.log(`   🧪 Test: http://localhost:${PORT}/api/test`);
            console.log(`   ⚙️ Environment: ${config.server.env}`);
            console.log(`   🕐 Started: ${new Date().toISOString()}`);
        });
        
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🔄 Shutting down server...');
    await databaseManager.disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🔄 Shutting down server...');
    await databaseManager.disconnect();
    process.exit(0);
});

// Start the server
startServer();

