# Connect Caju Project

## Overview

The **Connect Caju** project provides an SMS notification system designed for areas with low internet connectivity. This system integrates with an SMS API to send messages and logs each action (both successful and failed messages) to a **MongoDB** database as part of an audit trail.

## Features

- **SMS Notifications**: Sends notifications to agents and clients using an SMS API.
- **Audit Trail**: Logs each SMS action (successes and failures) to MongoDB, including details like the message content, recipient, status, and timestamp.

## Prerequisites

1. **Node.js** (version 14 or higher)
2. **MongoDB**: A MongoDB instance for storing the audit trail.
3. **SMS API Credentials**: Credentials for the chosen SMS API.

## Setup Instructions

### Step 1: Clone the Repository

Clone the repository and navigate into the project directory:

```bash
git clone <repository-url>
cd ConnectCajuSMS
```

### Step 2: Install Dependencies

Install the necessary Node.js packages:

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory and add your environment variables:

```plaintext
SMS_API_ACCOUNT_SID=your_account_sid
SMS_API_AUTH_TOKEN=your_auth_token
SMS_API_PHONE_NUMBER=your_phone_number
MONGODB_URI=your_mongodb_uri
```

Make sure to replace `your_account_sid`, `your_auth_token`, `your_phone_number`, and `your_mongodb_uri` with your actual SMS API and MongoDB credentials.

### Step 4: Run the SMS Script

You can send an SMS and log the result to MongoDB using the following command:

```bash
node sendSMS.js
```

### Example Usage in Code

To use the `sendSMS` function in your own code, you can call it like this:

```javascript
// Example of sending an SMS
sendSMS('+1234567890', 'Your shipment has been dispatched.');
```

## Project Structure

- **sendSMS.js**: Contains the `sendSMS` function, which sends an SMS through the SMS API and logs the result to MongoDB.
- **.env**: Stores environment variables for secure access to SMS API and MongoDB credentials (not included in the repository for security).
- **package.json**: Lists the project dependencies.

## Logging and Audit Trail

Each SMS sent or failed attempt is logged in the MongoDB `AuditTrail` collection. The logs include:
- **Timestamp**: When the SMS action was performed.
- **Action**: Whether the SMS was sent or failed.
- **Details**: Information about the recipient, message content, status, and any error details if applicable.

## Troubleshooting

- **Invalid "From" Number or Credentials**: Ensure you’re using your verified phone number and correct credentials in the environment variables.
- **MongoDB Connection Issues**: Double-check your `MONGODB_URI` and ensure your MongoDB instance is accessible.

## License

This project is licensed under [MIT License](LICENSE).

## Contact

For questions, contact the project team or open an issue in the repository.

---

This version keeps the SMS API details flexible for future adjustments. Let me know if there’s anything more specific you’d like included!
