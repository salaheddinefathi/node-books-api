require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const Admin = require('./server/models/Admin');

const seedAdmin = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI not found in env');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit();
        }

        const admin = new Admin({
            username: 'admin',
            password: 'adminpassword123'
        });

        await admin.save();
        console.log('Admin user created successfully');
        console.log('Username: admin');
        console.log('Password: adminpassword123');
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
