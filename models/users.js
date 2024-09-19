const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profile: { type: String, required: true },
}, { timestamps: true });

userSchema.index({ name: 1 });

module.exports = userSchema;
