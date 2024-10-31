const { MongoClient } = require("mongodb");
require('dotenv').config();

const watchCollection = require("./watchCollection");

const uri = process.env.CONNECTION_STRING;
const client = new MongoClient(uri);

const logToAuditTrail = async (messageDetails) => {
    try {
        const auditCollection = client.db(process.env.DB).collection("AuditTrail");
        await auditCollection.insertOne({
            message: messageDetails.message,
            to: messageDetails.to,
            status: messageDetails.status,
            timestamp: new Date()
        });
        console.log("Log entry added to audit trail.");
    } catch (error) {
        console.error("Failed to log to audit trail:", error);
    }
};

async function main() {
    try {
        await client.connect();
        const collectionName = 'Shipment';
        const database = client.db(process.env.DB);
        const collection = database.collection(collectionName);

        // Pass a callback for logging to audit trail
        watchCollection.watchCollection(collection, logToAuditTrail);
    } catch (error) {
        console.error("Error Connecting to Database", error);
    }
}

// Start the main function
main();

process.on('SIGINT', async () => {
    console.log("Closing MongoDB connection");
    await client.close();
    process.exit(0);
});
