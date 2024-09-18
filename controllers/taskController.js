const jwt = require('jsonwebtoken');
const { context } = require('../models/index');

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
