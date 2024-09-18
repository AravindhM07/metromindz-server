const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId },
    title: { type: String, required: true },
    details: { type: String },
    date: { type: Date, required: true },
    priority: {
        type: String,
        required: true,
        enum: ['Low', 'Medium', 'High'],
    },
    isCompleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = taskSchema;
