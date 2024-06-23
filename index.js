const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');

const dbConnect = require('./db/dbConnect');
const registerRouter = require('./routes/auth/register');
const loginRouter = require('./routes/auth/login');
const homepageRouter = require('./routes/homepage');
const logoutRouter = require('./routes/profile/logout');
const requestOTPRouter = require('./routes/auth/account/request-otp');
const verifyOTPRouter = require('./routes/auth/account/verify-otp');
const newPwdRouter = require('./routes/auth/account/new-password');
const requestPwdChangeRouter = require('./routes/profile/request-pwd-change');
const oAuthGoogleRouter = require('./routes/auth/oauth/oauth-google');
const getUserProfileRouter = require('./routes/profile/get-user-profile');
const updateUserProfileRouter = require('./routes/profile/update-user-profile');
const getActivitiesHistoryRouter = require('./routes/activities/get-activities-history');
const saveTrackableActivityRouter = require('./routes/activities/save-trackable-activity');
const saveUntrackableActivityRouter = require('./routes/activities/save-untrackable-activity');
const getDefinedActivitiesRouter = require('./routes/activities/get-defined-activities');
const deleteTrackableActivityRouter = require('./routes/activities/delete-trackable-activity');
const deleteUntrackableActivityRouter = require('./routes/activities/delete-untrackable-activity');
const getPeriodicSummariesHistoryRouter = require('./routes/daily-summaries/get-periodic-summaries-history');
const updateDailySummariesRouter = require('./routes/daily-summaries/update-daily-summaries');
const getUsersVsTimeRouter = require('./routes/admin/dashboard/get-users-vs-time');
const vendorRegistrationRouter = require('./routes/admin/vendor/register');
const vendorUploadCertificatesRouter = require('./routes/admin/vendor/upload-certificates');
const vendorGetVendorDetailsRouter = require('./routes/admin/vendor/get-vendor-details');
const usersReadRouter = require('./routes/admin/users/read');
const usersUpdateRouter = require('./routes/admin/users/update');
const usersWriteRouter = require('./routes/admin/users/write');
const usersDeleteRouter = require('./routes/admin/users/delete');
const usersGetActivitiesHistoryRouter = require('./routes/admin/users/get-activities-history');
const activitieshistoryReadRouter = require('./routes/admin/activitieshistory/read');
const activitieshistoryUpdateRouter = require('./routes/admin/activitieshistory/update');
const activitieshistoryWriteRouter = require('./routes/admin/activitieshistory/write');
const activitieshistoryDeleteRouter = require('./routes/admin/activitieshistory/delete');


const app = express();

//CORS config
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}
app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/auth/register', registerRouter);
app.use('/auth/login', loginRouter);
app.use('/auth/oauth/oauth-google', oAuthGoogleRouter);
app.use('/auth/account/request-otp', requestOTPRouter);
app.use('/auth/account/verify-otp', verifyOTPRouter);
app.use('/auth/account/new-password', newPwdRouter);

app.use('/homepage', homepageRouter);

app.use('/profile/get-user-profile', getUserProfileRouter);
app.use('/profile/update-user-profile', updateUserProfileRouter);
app.use('/profile/request-pwd-change', requestPwdChangeRouter);
app.use('/profile/logout', logoutRouter);

app.use('/activities/get-defined-activities', getDefinedActivitiesRouter);
app.use('/activities/get-activities-history', getActivitiesHistoryRouter);
app.use('/activities/save-trackable-activity', saveTrackableActivityRouter);
app.use('/activities/save-untrackable-activity', saveUntrackableActivityRouter);
app.use('/activities/delete-trackable-activity', deleteTrackableActivityRouter);
app.use('/activities/delete-untrackable-activity', deleteUntrackableActivityRouter);

app.use('/daily-summaries/get-periodic-summaries-history', getPeriodicSummariesHistoryRouter);
app.use('/daily-summaries/update-daily-summaries', updateDailySummariesRouter);

app.use('/admin/dashboard/get-users-vs-time', getUsersVsTimeRouter);
app.use('/admin/vendor/register', vendorRegistrationRouter);
app.use('/admin/vendor/upload-certificates', vendorUploadCertificatesRouter);
app.use('/admin/vendor/get-vendor-details', vendorGetVendorDetailsRouter);
app.use('/admin/users/read', usersReadRouter);
app.use('/admin/users/update', usersUpdateRouter)
app.use('/admin/users/write', usersWriteRouter);
app.use('/admin/users/delete', usersDeleteRouter);
app.use('/admin/users/get-activities-history', usersGetActivitiesHistoryRouter);
app.use('/admin/activitieshistory/read', activitieshistoryReadRouter);
app.use('/admin/activitieshistory/update', activitieshistoryUpdateRouter);
app.use('/admin/activitieshistory/write', activitieshistoryWriteRouter);
app.use('/admin/activitieshistory/delete', activitieshistoryDeleteRouter);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Create the `assets` folder and it's subdirectories if it doesn't exist
const assetsFolder = './assets';
if (!fs.existsSync(assetsFolder)) {
    fs.mkdirSync(assetsFolder);
    fs.mkdirSync(`${assetsFolder}/profile-pictures`);
    fs.mkdirSync(`${assetsFolder}/map-thumbnails`);
}

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

