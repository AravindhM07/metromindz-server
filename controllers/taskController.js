const jwt = require('jsonwebtoken');
const { context } = require('../models/index');
const { mongo, default: mongoose } = require('mongoose');

const handleErrorResponse = (res, status, message, error = null) => {
    return res.status(status).json({ message, ...(error && { error: error.message }) });
};

exports.createTask = async (req, res) => {
    try {
        const token = req.cookies.token;
        const { title, details, date, priority } = req.body;
        if (!title || !details || !date || !priority) {
            return handleErrorResponse(res, 400, 'All fields are required.');
        }

        const { id: userId } = jwt.verify(token, process.env.JWT_SECRET);

        const foundUser = await context.user.findById(userId).select('-password');
        if (!foundUser) {
            return handleErrorResponse(res, 404, 'User not found');
        }

        await new context.task({
            userId: foundUser._id,
            title,
            details,
            date,
            priority
        }).save();

        return res.status(200).json({ message: 'Task created successfully!' });
    } catch (error) {
        console.error('createTask error:', error);
        return handleErrorResponse(res, 500, 'Error occurred while creating task', error);
    }
};

exports.fetchTasks = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return handleErrorResponse(res, 401, 'Unauthorized');
    }

    try {
        const { id: userId } = jwt.verify(token, process.env.JWT_SECRET);

        const foundUser = await context.user.findById(userId).select('-password');
        if (!foundUser) {
            return handleErrorResponse(res, 404, 'User not found');
        }

        const taskLists = await context.task.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(foundUser._id)
                }
            }
        ]);

        return res.status(200).json(taskLists);
    } catch (error) {
        console.error('fetchUserProfile error:', error);
        return handleErrorResponse(res, 401, 'Invalid token', error);
    }
};
