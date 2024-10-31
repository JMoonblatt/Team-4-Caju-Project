# Connect Caju SMS Notification Service

This project monitors shipment data from a MongoDB database and sends SMS notifications to agents via an SMS API.

## Setup

1. **Clone this repository**.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Create a `.env` file** in the root directory and add the following:
   ```plaintext
   CONNECTION_STRING=mongodb+srv://username:password@yourcluster.mongodb.net/
   DB=ConnectCajuTestingDB
   SMS_API_KEY=your_sms_to_api_key
   ```

## Running the Application

To start the application, run:
```bash
npm start
```

## Dependencies

- **Node.js**
- **MongoDB**
- **dotenv**
- **axios**

## Note

Make sure to keep sensitive information secure and avoid hard-coding API keys in the source code. The SMS API provider may be changed in the future if necessary.
