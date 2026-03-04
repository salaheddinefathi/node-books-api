const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
}, { timestamps: true });

// Passwords are now hashed in the route

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcryptjs.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
