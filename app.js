require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const indexRoutes = require('./routes/indexRoutes');

// Initialize the express app.
const app = express();

// Connect mongo database
connectDB();

app.use(express.urlencoded({
    extended: true,
    limit: '50mb'
}));
app.use(express.json({ limit: '50mb' }));
app.use(cors({ origin: 'https://metromindz-client.vercel.app', credentials: true }));
app.use(cookieParser());

// User routes
app.use('/', indexRoutes);

app.get('/', (req, res) => {
    res.json({ success: true, message: 'Request was successfull!' });
})

app.listen(process.env.PORT, () => {
    console.log('Server running at port: 3001');
});