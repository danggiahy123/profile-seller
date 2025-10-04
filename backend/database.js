const { MongoClient } = require('mongodb');
const config = require('./config');
const mongoose = require('mongoose');

class DatabaseManager {
    constructor() {
        this.client = null;
        this.db = null;
        this.mongooseConnection = null;
    }

    // Kết nối MongoDB bằng MongoDB Native Driver
    async connect() {
        try {
            console.log('🔄 Đang kết nối MongoDB...');
            
            this.client = new MongoClient(config.mongodb.uri, config.mongodb.options);
            await this.client.connect();
            
            this.db = this.client.db(config.mongodb.database);
            
            console.log('✅ Đã kết nối MongoDB thành công!');
            console.log(`📊 Database: ${config.mongodb.database}`);
            console.log(`🌐 Host: localhost:27017`);
            
            // Test connection
            await this.testConnection();
            
            return this.db;
        } catch (error) {
            console.error('❌ Lỗi kết nối MongoDB:', error.message);
            throw error;
        }
    }

    // Kết nối MongoDB bằng Mongoose ODM
    async connectMongoose() {
        try {
            console.log('🔄 Đang kết nối MongoDB qua Mongoose...');
            
            this.mongooseConnection = await mongoose.connect(config.mongodb.uri, config.mongodb.options);
            
            console.log('✅ Đã kết nối MongoDB qua Mongoose thành công!');
            console.log(`📊 Ready State: ${mongoose.connection.readyState}`);
            
            // Event handlers
            mongoose.connection.on('connected', () => {
                console.log('🔗 Mongoose connected to MongoDB');
            });
            
            mongoose.connection.on('error', (err) => {
                console.error('❌ Mongoose connection error:', err);
            });
            
            mongoose.connection.on('disconnected', () => {
                console.log('🔌 Mongoose disconnected');
            });
            
            return mongoose.connection;
        } catch (error) {
            console.error('❌ Lỗi kết nối Mongoose:', error.message);
            throw error;
        }
    }

    // Test kết nối
    async testConnection() {
        try {
            // Test MongoDB Native
            const collection = this.db.collection('test');
            await collection.findOne({});
            console.log('✅ MongoDB Native Driver: OK');
            
        } catch (error) {
            console.error('❌ MongoDB Native Driver test failed:', error.message);
        }
    }

    // Lấy collections
    async getCollections() {
        try {
            if (!this.db) {
                throw new Error('Database not connected');
            }
            
            const collections = await this.db.listCollections().toArray();
            console.log('📂 Collections:', collections.map(c => c.name));
            return collections;
        } catch (error) {
            console.error('❌ Error getting collections:', error.message);
            throw error;
        }
    }

    // Lấy stats database
    async getStats() {
        try {
            if (!this.db) {
                throw new Error('Database not connected');
            }
            
            const stats = await this.db.stats();
            console.log('📈 Database Stats:');
            console.log(`   Collections: ${stats.collections}`);
            console.log(`   Data Size: ${stats.dataSize} bytes`);
            console.log(`   Index Size: ${stats.indexSize} bytes`);
            console.log(`   Storage Size: ${stats.storageSize} bytes`);
            
            return stats;
        } catch (error) {
            console.error('❌ Error getting stats:', error.message);
            throw error;
        }
    }

    // Đóng kết nối
    async disconnect() {
        try {
            if (this.client) {
                await this.client.close();
                console.log('🔌 Đã đóng MongoDB connection');
            }
            
            if (mongoose.connection.readyState === 1) {
                await mongoose.disconnect();
                console.log('🔌 Đã đóng Mongoose connection');
            }
        } catch (error) {
            console.error('❌ Error disconnecting:', error.message);
        }
    }
}

// Export singleton instance
const databaseManager = new DatabaseManager();
module.exports = databaseManager;

