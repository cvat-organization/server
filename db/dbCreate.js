const mongoose = require('mongoose');

const uri = "mongodb+srv://admin:rkoprex@cluster0.yy0zmye.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const definedActivities = require('./definedActivities');

// Import Mongoose schemas
const users = require('../models/users');
const passwordResetRequests = require('../models/passwordResetRequests');
const configActivitiesParameters = require('../models/configActivitiesParameters');
const activitiesHistory = require('../models/activitiesHistory');

const clientOptions = { 
    serverApi: { version: '1', strict: true, deprecationErrors: true },
    dbName: 'cv-activity-tracker'
};

async function run() {
    try {
        // Connect to the database
        await mongoose.connect(uri, clientOptions);
        console.log("Connected to the database");

        // Create collections based on schemas
        await Promise.all([
            users.createCollection(),
            passwordResetRequests.createCollection(),
            configActivitiesParameters.createCollection(),
            configActivitiesParameters.insertMany(definedActivities),
            activitiesHistory.createCollection()
        ]);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Database created successfully!");
    }
    finally {
        // Ensures that the client will close when you finish/error
        await mongoose.disconnect();
    }
}
run().catch(console.dir);
