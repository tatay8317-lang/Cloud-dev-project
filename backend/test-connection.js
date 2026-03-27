const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
    console.log('\n🔍 Testing MongoDB Connection with Updated Credentials...\n');
    
    const mongooseOptions = {
        serverSelectionTimeoutMS: 5000,
    };

    try {
        // Try Atlas connection first
        if (process.env.MONGO_URI) {
            console.log('📍 Connecting to MongoDB Atlas...');
            console.log(`   URI: ${process.env.MONGO_URI.substring(0, 50)}...`);
            
            await mongoose.connect(process.env.MONGO_URI, mongooseOptions);
            console.log('✅ SUCCESS: MongoDB Atlas Connected!\n');
            console.log('📊 Connection Details:');
            console.log(`   • Status: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
            console.log(`   • Host: cluster.ezj9vyw.mongodb.net`);
            console.log(`   • Database: ${mongoose.connection.name}\n`);
            
            await mongoose.connection.close();
            process.exit(0);
        }
    } catch (atlasErr) {
        console.error('❌ MongoDB Atlas connection failed:', atlasErr.message);
        console.log('📍 Attempting local MongoDB fallback...\n');
        
        try {
            const localUri = 'mongodb://127.0.0.1:27017/cloud-devops-project';
            await mongoose.connect(localUri, mongooseOptions);
            console.log('✅ SUCCESS: MongoDB Local Connected!\n');
            console.log('📊 Connection Details:');
            console.log(`   • Status: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
            console.log(`   • Host: localhost:27017`);
            console.log(`   • Database: ${mongoose.connection.name}\n`);
            
            await mongoose.connection.close();
            process.exit(0);
        } catch (localErr) {
            console.error('❌ Local MongoDB connection failed:', localErr.message);
            process.exit(1);
        }
    }
};

testConnection();
