const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection with smart fallback
const mongooseOptions = {
    serverSelectionTimeoutMS: 5000,
};

const connectDatabase = async () => {
    try {
        // Try Atlas connection first (from environment variable)
        if (process.env.MONGO_URI) {
            try {
                await mongoose.connect(process.env.MONGO_URI, mongooseOptions);
                console.log('✅ MongoDB Atlas Connected');
                return;
            } catch (atlasErr) {
                console.error('❌ MongoDB Atlas connection failed:', atlasErr.message);
                
                // In production, Atlas is required
                if (process.env.NODE_ENV === 'production') {
                    throw atlasErr;
                }
            }
        }

        // Try local MongoDB as fallback (only in development)
        if (process.env.NODE_ENV !== 'production') {
            const localUri = 'mongodb://127.0.0.1:27017/cloud-devops-project';
            console.warn(`📍 Attempting local MongoDB fallback (${localUri})...`);
            await mongoose.connect(localUri, mongooseOptions);
            console.log('✅ MongoDB Local Connected');
            return;
        }

        // Production without MONGO_URI or local MongoDB
        console.error('❌ FATAL: No MongoDB connection available');
        process.exit(1);

    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1);
    }
};

// Initialize database connection
connectDatabase();

// Test Route
app.get('/', (req, res) => {
    res.send("API Running");
});

// Routes
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});