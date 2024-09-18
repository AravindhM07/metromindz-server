const mongoose = require('mongoose');
const userSchema = require('./users');

exports.context = {
    user: mongoose.model('metromindzuser', userSchema),
};
