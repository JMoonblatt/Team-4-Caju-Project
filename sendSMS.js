require('dotenv').config();
const { MongoClient } = require('mongodb');

// Replace this with the appropriate client initialization for your chosen SMS API
const smsClient = require('your-sms-api-client'); // Replace 'your-sms-api-client' with the actual SMS API library

const accountSid = process.env.SMS_API_ACCOUNT_SID;
const authToken = process.env.SMS_API_AUTH_TOKEN;
const mongoUri = process.env.MONGODB_URI;

// Initialize SMS API client
const client = smsClient(accountSid, authToken);

async function sendSMS(to, message) {
  // Declare mongoClient within the function scope
  const mongoClient = new MongoClient(mongoUri);

  try {
    // Send SMS via chosen API
    const response = await client.messages.create({
      body: message,
      to: to,             
      from: process.env.SMS_API_PHONE_NUMBER  // Ensure this is set in your .env file
    });

    // Log success to MongoDB
    await mongoClient.connect();
    const db = mongoClient.db('ConnectCajuTestingDB');
    await db.collection('AuditTrail').insertOne({
      timestamp: new Date(),
      action: 'SMS Sent',
      details: {
        message,
        to,
        status: response.status
      }
    });
    
    console.log(`SMS sent to ${to}:`, response.sid);
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
    // Ensure MongoDB client is closed in all cases
    await mongoClient.close();
  }
}

// Example usage
sendSMS('+1234567890', 'Your shipment has been dispatched.');
