require('dotenv').config();
const axios = require('axios');
const { MongoClient } = require('mongodb');

// Initialize MongoDB client outside the function to avoid multiple connections
let mongoClient;

async function connectToMongoDB() {
  if (!mongoClient) {
    mongoClient = new MongoClient(process.env.CONNECTION_STRING, { useUnifiedTopology: true });
    await mongoClient.connect();
  }
}

async function sendSMS(to, name, shipmentStatus, currentLocation, estimatedDelivery) {
  const message = `Hello ${name}, your shipment is currently ${shipmentStatus}. It is now at ${currentLocation} and is expected to arrive by ${estimatedDelivery}.`;

  try {
    // Connect to MongoDB if not already connected
    await connectToMongoDB();
    console.log("Connected to MongoDB");

    // Send SMS through SMS.to API
    const response = await axios.post(
      'https://api.sms.to/sms/send',
      {
        to: to,
        message: message,
        sender_id: 'YourSenderID' // Optional, configurable based on SMS.to settings
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.SMS_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`SMS sent to ${to}:`, response.data);

    // Log success to MongoDB
    const db = mongoClient.db(process.env.DB);
    await db.collection('AuditTrail').insertOne({
      timestamp: new Date(),
      action: 'SMS Sent',
      details: {
        message,
        to,
        status: response.data.status
      }
    });

    return { status: 'success', response: response.data };

  } catch (error) {
    console.error('Error sending SMS:', error.message);

    // Log failure to MongoDB
    const db = mongoClient.db(process.env.DB);
    await db.collection('AuditTrail').insertOne({
      timestamp: new Date(),
      action: 'SMS Failed',
      details: {
        message,
        to,
        error: error.message
      }
    });

    return { status: 'error', error: error.message };
  } finally {
    console.log("Operation complete.");
  }
}

module.exports = { sendSMS };
