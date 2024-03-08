const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const dbConnect = require('./db/dbConnect');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const homepageRouter = require('./routes/homepage');
const logoutRouter = require('./routes/logout');
const requestOTPRouter = require('./routes/request-otp');
const verifyOTPRouter = require('./routes/verify-otp');
const newPwdRouter = require('./routes/new-password');
const requestPwdChangeRouter = require('./routes/request-pwd-change');

const app = express();

//CORS config
const corsOptions = {
    origin: ['http://localhost:3000', 'http://192.168.0.108:8081'],
    credentials: true
}
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/homepage', homepageRouter);
app.use('/logout', logoutRouter);
app.use('/request-otp', requestOTPRouter);
app.use('/verify-otp', verifyOTPRouter);
app.use('/new-password', newPwdRouter);
app.use('/request-pwd-change', requestPwdChangeRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Connect to the database
dbConnect().catch(console.error);

// Start the server
const PORT = 4000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Test the database connection
mongoose.connection.on('error', (error) => {
    console.error('Error connecting to MongoDB:', error);
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

