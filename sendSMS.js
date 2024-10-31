require('dotenv').config();
const { MongoClient } = require('mongodb');
const axios = require('axios');

// Environment variables
const smsApiKey = process.env.SMS_API_KEY;
const mongoUri = process.env.MONGODB_URI;

// MongoDB client setup
const mongoClient = new MongoClient(mongoUri);

async function sendSMS(to, name, shipmentStatus, currentLocation, estimatedDelivery) {
  const message = `Hello ${name}, your shipment is currently ${shipmentStatus}. ` +
                  `It is now at ${currentLocation} and is expected to arrive by ${estimatedDelivery}.`;

  try {
    // Send SMS via sms.to API
    const response = await axios.post(
      'https://api.sms.to/sms/send',
      {
        to: to,
        message: message,
        sender_id: 'YourSenderID'
      },
      {
        headers: {
          'Authorization': `Bearer ${smsApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Log success to MongoDB
    await mongoClient.connect();
    const db = mongoClient.db('ConnectCajuTestingDB');
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
  } catch (error) {
    console.error('Error sending SMS:', error);

    // Log failure to MongoDB
    await mongoClient.connect();
    const db = mongoClient.db('ConnectCajuTestingDB');
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
  }
}

// Example usage
sendSMS('+1234567890', 'John Doe', 'in transit', 'City B', '5 PM');
