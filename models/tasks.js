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

taskSchema.index({ userId: 1 });
taskSchema.index({ date: 1 });
taskSchema.index({ userId: 1, date: 1 });
taskSchema.index({ priority: 1 });

module.exports = taskSchema;
