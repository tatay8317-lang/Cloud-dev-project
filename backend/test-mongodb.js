const mongoose = require('mongoose');

// Test connection to MongoDB
const testMongoDB = async () => {
    try {
        console.log('🔍 Testing MongoDB Connection...\n');
        
        // Try local MongoDB first
        console.log('📍 Attempting local MongoDB connection...');
        const localUri = 'mongodb://127.0.0.1:27017/cloud-devops-project';
        
        await mongoose.connect(localUri);
        console.log('✅ LOCAL MongoDB Connected Successfully!\n');
        
        // Get database info
        const db = mongoose.connection;
        console.log('📊 Database Info:');
        console.log(`   • Host: localhost:27017`);
        console.log(`   • Database: cloud-devops-project`);
        console.log(`   • Status: ${db.readyState === 1 ? 'Connected' : 'Disconnected'}\n`);
        
        // List all collections
        const collections = await db.db.listCollections().toArray();
        console.log('📋 Collections in Database:');
        if (collections.length === 0) {
            console.log('   • No collections yet (will be created on first task add)\n');
        } else {
            collections.forEach(col => {
                console.log(`   • ${col.name}`);
            });
            console.log();
        }
        
        // Try Atlas MongoDB as secondary
        console.log('🌐 Testing MongoDB Atlas Connection...');
        const atlasUri = 'mongodb+srv://sadhu8101_db_user:cp6iLjeDZ4k5yaWu@cluster.ezj9yvw.mongodb.net/?retryWrites=true&w=majority';
        
        try {
            await mongoose.connect(atlasUri, { serverSelectionTimeoutMS: 3000 });
            console.log('✅ ATLAS MongoDB Connected Successfully!\n');
        } catch (atlasErr) {
            console.log(`❌ ATLAS Connection Failed: ${atlasErr.message}`);
            console.log('   • This is expected in restricted networks\n');
        }
        
        // Test collection operations
        console.log('🧪 Testing CRUD Operations...');
        
        const Task = require('./models/Task');
        
        // Clear existing test tasks
        await Task.deleteMany({ title: { $regex: 'Test Task' } });
        
        // CREATE
        const newTask = await Task.create({ title: 'Test Task - Check DB' });
        console.log('✅ CREATE: Task added successfully');
        console.log(`   • ID: ${newTask._id}`);
        console.log(`   • Title: ${newTask.title}\n`);
        
        // READ
        const allTasks = await Task.find();
        console.log(`✅ READ: Retrieved ${allTasks.length} task(s)`);
        allTasks.forEach(t => {
            console.log(`   • ${t.title} (Completed: ${t.completed})`);
        });
        console.log();
        
        // UPDATE
        const updated = await Task.findByIdAndUpdate(
            newTask._id,
            { completed: true },
            { new: true }
        );
        console.log('✅ UPDATE: Task updated');
        console.log(`   • Completed: ${updated.completed}\n`);
        
        // DELETE
        await Task.findByIdAndDelete(newTask._id);
        console.log('✅ DELETE: Test task removed\n');
        
        console.log('✨ MongoDB is working perfectly! All operations successful.\n');
        
        await mongoose.connection.close();
        
    } catch (err) {
        console.error('❌ ERROR:', err.message);
        process.exit(1);
    }
};

testMongoDB();
