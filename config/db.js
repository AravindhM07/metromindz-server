const mongoose = require('mongoose');

// Function to connect mongo database
const connectDB = async () => {
    try {
        console.log("Mongo URI:", process.env.DEV_MONGOURI);
        const conn = await mongoose.connect(process.env.DEV_MONGOURI, {
            maxPoolSize: 100, // controls the maximum number of connections in the connection pool
            connectTimeoutMS: 470000, // sets the maximum amount of time, in milliseconds.
            socketTimeoutMS: 470000, // 470 seconds timeout for waiting for server responses
        });

        console.log('MongoDB connected successfully! : ', conn.connection.host);
    } catch (error) {
        console.log('Error while connecting the Mongo server : ', error.message);
        // Exit the process with failure if the connection fails
        process.exit(1);
    }
};

module.exports = connectDB;