const mongoose = require('mongoose');

const uri = "mongodb+srv://admin:rkoprex@cluster0.yy0zmye.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const clientOptions = {
    serverApi: { version: '1', strict: true, deprecationErrors: true },
    dbName: 'cv-activity-tracker'
};

async function run() {
    try {
        await mongoose.connect(uri, clientOptions);
    } catch (err) {
        console.error(err);
    }
}

module.exports = run;