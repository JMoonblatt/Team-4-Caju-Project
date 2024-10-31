require('dotenv').config();
const axios = require('axios');

// MongoDB client setup
const mongoClient = new MongoClient(process.env.CONNECTION_STRING);

async function sendSMS(to, name, shipmentStatus, currentLocation, estimatedDelivery) {
  const message = `Hello ${name}, your shipment is currently ${shipmentStatus}. It is now at ${currentLocation} and is expected to arrive by ${estimatedDelivery}.`;

  try {
    const response = await axios.post(
      'https://api.sms.to/sms/send',
      {
        to: to,
        message: message,
        sender_id: 'YourSenderID'  // Optional, configurable based on SMS.to settings
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.SMS_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Log success to MongoDB
    await mongoClient.connect();
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

    console.log(`SMS sent to ${to}:`, response.data);
    return { status: 'success', response: response.data };
  } catch (error) {
    console.error('Error sending SMS:', error);

    // Log failure to MongoDB
    await mongoClient.connect();
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
  } finally {
    await mongoClient.close();
    return { status: 'error', error: error.message };
  }
}

module.exports = { sendSMS };
