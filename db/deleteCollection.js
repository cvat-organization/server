/* !! RUNNING THIS SCRIPT DELETES A COLLECTION !! */

const mongoose = require('mongoose');

const uri = "mongodb+srv://admin:rkoprex@cluster0.yy0zmye.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const clientOptions = { 
    serverApi: { version: '1', strict: true, deprecationErrors: true },
    dbName: 'cv-activity-tracker'
};

async function run() {
    try {
        // Connect to the database
        await mongoose.connect(uri, clientOptions);
        console.log("Connected to the Database");

        // DELETE the collection
        // await mongoose.connection.db.dropCollection('users');
        // await mongoose.connection.db.dropCollection('passwordresetrequests');
         await mongoose.connection.db.dropCollection('configactivitiesparameters');
         await mongoose.connection.db.dropCollection('activitieshistories');
        // await mongoose.connection.db.dropCollection('dailysummarieshistory');
        console.log("Collection(s) deleted successfully!");
    }
    finally {
        // Ensures that the client will close when you finish/error
        await mongoose.disconnect();
    }
}
run().catch(console.dir);
