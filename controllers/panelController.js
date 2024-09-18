const mongoose = require('mongoose');
const { context } = require('../models/index');
const jwt = require('jsonwebtoken');

const handleErrorResponse = (res, status, message, error = null) => {
    return res.status(status).json({ message, ...(error && { error: error.message }) });
};

exports.addCourses = async (req, res) => {
    try {
        const { title, description, price, firebaseThumbnailUrl, firebaseVideoUrl } = req.body;

        if (!title || !description || !price || !firebaseVideoUrl) {
            return handleErrorResponse(res, 400, 'Invalid details.');
        }

        const courseData = {
            title,
            description,
            price,
            thumbnailURL: firebaseThumbnailUrl,
            courseURL: firebaseVideoUrl,
        };

        const newCourse = await context.course(courseData).save();

        return res.status(200).json({ message: 'Course added successfully!', data: newCourse });
    } catch (error) {
        return handleErrorResponse(res, 500, 'Error occurred while adding the course.', error);
    }
};

exports.allCourses = async (req, res) => {
    try {
        const courses = await context.course.find().select('-courseURL');

        if (!courses.length) {
            return handleErrorResponse(res, 404, "No courses found.");
        }

        return res.status(200).json({ data: courses });
    } catch (error) {
        return handleErrorResponse(res, 500, "Error while retrieving all courses.", error);
    }
};

exports.storeEnrollRequest = async (req, res) => {
    try {
        const { name, email, currentRole, selectedCourse } = req.body;

        if (!name || !email || !currentRole || !selectedCourse) {
            return handleErrorResponse(res, 400, 'Invalid details.');
        }

        const enrollData = {
            name,
            email,
            currentRole,
            courseId: selectedCourse,
        };

        const addEnroll = await context.enrollRequest(enrollData).save();

        return res.status(200).json({ message: 'Enroll Request added successfully!', data: addEnroll });
    } catch (error) {
        return handleErrorResponse(res, 500, 'Error occurred while adding the Enroll Request.', error);
    }
};

exports.getAllEnrollRequest = async (req, res) => {
    try {
        const response = await context.enrollRequest.aggregate([
            {
                $lookup: {
                    from: "courses",
                    localField: "courseId",
                    foreignField: "_id",
                    as: "courseDetails",
                },
            },
            {
                $unwind: "$courseDetails",
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    currentRole: 1,
                    createdAt: 1,
                    courseTitle: "$courseDetails.title",
                    thumbnailURL: "$courseDetails.thumbnailURL",
                },
            },
        ]);

        return res.status(200).json({ data: response });
    } catch (error) {
        return handleErrorResponse(res, 500, 'Error occurred while fetching all enroll requests.', error);
    }
};

exports.acceptEnrollRequest = async (req, res) => {
    try {
        const { id } = req.query;

        const enrollRequest = await context.enrollRequest.findById(id).select('email courseId');
        await context.enrollRequest.deleteOne({ _id: id });

        const { email, courseId } = enrollRequest;
        const user = await context.user.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (!user.courses.includes(courseId)) {
            user.courses.push(courseId);
            await user.save();
        }

        return res.status(200).json({ message: 'Request accepted successfully!' });
    } catch (error) {
        return res.status(500).json({ message: 'Error occurred while accepting the request.', error: error.message });
    }
};

exports.deleteEnrollRequest = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: 'Request ID is required.' });
        }
        const deleteResult = await context.enrollRequest.deleteOne({ _id: id });

        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ message: 'Enroll request not found.' });
        }

        return res.status(200).json({ message: 'Request deleted successfully!' });
    } catch (error) {
        return handleErrorResponse(res, 500, 'Error occurred while deleting request.', error);
    }
};

exports.fetchAssignedCourses = async (req, res) => {
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

        const getAssignedCourses = await context.user.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(foundUser._id)
                }
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "courses",
                    foreignField: "_id",
                    as: "data"
                }
            },
            {
                $project: {
                    _id: 0,
                    data: 1
                }
            }
        ]);

        return res.status(200).json({ data: getAssignedCourses });
    } catch (error) {
        console.error('fetchUserProfile error:', error);
        return handleErrorResponse(res, 401, 'Invalid token', error);
    }
};
