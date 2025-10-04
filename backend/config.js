// MongoDB Configuration
module.exports = {
    // MongoDB connection
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/profile_seller',
        database: process.env.MONGODB_DATABASE || 'profile_seller',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },
    
    // Server configuration
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development'
    },
    
    // JWT configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
        expiresIn: '24h'
    },
    
    // CORS configuration
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true
    }
};

