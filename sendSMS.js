require('dotenv').config();
const axios = require('axios');

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

    console.log(`SMS sent to ${to}:`, response.data);
    return { status: 'success', response: response.data };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { status: 'error', error: error.message };
  }
}

module.exports = { sendSMS };
