const jwt = require('jsonwebtoken');
const { context } = require('../models/index'); // Ensure correct path to the context

const handleErrorResponse = (res, status, message, error = null) => {
    return res.status(status).json({ message, ...(error && { error: error.message }) });
};

// Middleware to authenticate JWT
const clientAuth = async (req, res, next) => {
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

        req.user = foundUser;

        next();
    } catch (error) {
        console.error('fetchUserProfile error:', error);
        return handleErrorResponse(res, 401, 'Invalid token', error);
    }
};

module.exports = clientAuth;
