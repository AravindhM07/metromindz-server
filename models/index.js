const mongoose = require('mongoose');
const userSchema = require('./users');
const taskSchema = require('./tasks');

exports.context = {
    user: mongoose.model('metromindzuser', userSchema),
    task: mongoose.model('metromindztask', taskSchema),
};
