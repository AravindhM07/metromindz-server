const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { context } = require('../models/index');

const handleErrorResponse = (res, status, message, error = null) => {
    return res.status(status).json({ message, ...(error && { error: error.message }) });
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, image } = req.body;

        if (!name || !email || !password || !image) {
            return handleErrorResponse(res, 400, 'All fields are required.');
        }

        const existingUser = await context.user.findOne({ email });
        if (existingUser) {
            return handleErrorResponse(res, 400, 'User already exists.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await context.user({ name, email, password: hashedPassword, profile: image }).save();

        // Create a JWT token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 3600000, // 1 hour
        });

        return res.status(200).json({ message: 'User created successfully!', token });
    } catch (error) {
        console.error('createUser error:', error);
        return handleErrorResponse(res, 500, 'Error occurred while creating user', error);
    }
};

exports.fetchUserProfile = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return handleErrorResponse(res, 401, 'Unauthorized');
    }

    try {
        const { id: userId } = jwt.verify(token, process.env.JWT_SECRET);
        const foundUser = await context.user.findById(userId).select('-password -image');

        if (!foundUser) {
            return handleErrorResponse(res, 404, 'User not found');
        }

        return res.status(200).json(foundUser);
    } catch (error) {
        console.error('fetchUserProfile error:', error);
        return handleErrorResponse(res, 401, 'Invalid token', error);
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return handleErrorResponse(res, 400, 'Email and password are required.');
        }

        const existingUser = await context.user.findOne({ email });
        if (!existingUser) {
            return handleErrorResponse(res, 401, 'Invalid email or password.');
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return handleErrorResponse(res, 401, 'Invalid email or password.');
        }

        const token = jwt.sign(
            { id: existingUser._id, email: existingUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 3600000, // 1 hour
        });

        return res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        console.error('login error:', error);
        return handleErrorResponse(res, 500, 'Error occurred while logging in', error);
    }
};

exports.logout = (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 0, // Expire immediately
        });
        return res.status(200).json({ message: 'Logout successful!' });
    } catch (error) {
        console.error('logout error:', error);
        return handleErrorResponse(res, 500, 'Logout failed', error);
    }
};