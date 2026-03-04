const mongoose = require('mongoose');
const User = require('./models/User');
const fs = require('fs');
require('dotenv').config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB Connected');

        const testUser = new User({
            userId: 'TEST-' + Date.now(),
            name: 'Test',
            email: 'test-' + Date.now() + '@example.com',
            phone: '1234567890',
            password: 'password123'
        });

        await testUser.save();
        console.log('User saved successfully');

        await User.deleteOne({ _id: testUser._id });
        console.log('Cleanup done');

        process.exit(0);
    } catch (err) {
        const errorDetails = `
Error Name: ${err.name}
Error Message: ${err.message}
Validation Errors: ${err.errors ? JSON.stringify(err.errors, null, 2) : 'None'}
Stack: ${err.stack}
`;
        fs.writeFileSync('error-log.txt', errorDetails);
        console.error('TEST FAILED - see error-log.txt');
        process.exit(1);
    }
}

test();
