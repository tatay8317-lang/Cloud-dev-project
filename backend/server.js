const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI =
    process.env.MONGO_URI ||
    'mongodb+srv://sadhu8101_db_user:cp6iLjeDZ4k5yaWu@cluster.ezj9yvw.mongodb.net/?retryWrites=true&w=majority';

// If SRV DNS lookups fail (common on restricted networks), force a public DNS server.
if (MONGO_URI.startsWith('mongodb+srv://')) {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const mongooseOptions = {
    serverSelectionTimeoutMS: 5000, // fail fast if cannot connect
};

mongoose
    .connect(MONGO_URI, mongooseOptions)
    .then(() => console.log('MongoDB Connected'))
    .catch(async (err) => {
        console.error('MongoDB connection error:', err);

        // If Atlas is unreachable, fall back to local MongoDB (useful on restricted networks)
        if (process.env.NODE_ENV !== 'production') {
            const localUri = 'mongodb://127.0.0.1:27017/cloud-devops-project';
            console.warn(`Attempting fallback to local MongoDB (${localUri})...`);
            try {
                await mongoose.connect(localUri);
                console.log('MongoDB Connected to local instance');
                return;
            } catch (localErr) {
                console.error('Local MongoDB connection error:', localErr);
            }
        }

        process.exit(1);
    });

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