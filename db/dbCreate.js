const mongoose = require('mongoose');

const uri = "mongodb+srv://admin:rkoprex@cluster0.yy0zmye.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Import Mongoose schemas
const users = require('../models/users');
const sessions = require('../models/sessions');
const passwordResetRequests = require('../models/passwordResetRequests');
const loginAttempts = require('../models/loginAttempts');

const clientOptions = { 
    serverApi: { version: '1', strict: true, deprecationErrors: true },
    dbName: 'cv-activity-tracker'
};

async function run() {
    try {
        await mongoose.connect(uri, clientOptions);

        // Create collections based on schemas
        await Promise.all([
            users.createCollection(),
            sessions.createCollection(),
            passwordResetRequests.createCollection(),
            loginAttempts.createCollection()
        ]);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
        // Ensures that the client will close when you finish/error
        await mongoose.disconnect();
    }
}
run().catch(console.dir);
