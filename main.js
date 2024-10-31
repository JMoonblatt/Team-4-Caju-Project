const { MongoClient } = require("mongodb");
require('dotenv').config();

const watchCollection = require("./watchCollection");

try {
    const uri = process.env.CONNECTION_STRING;
    const client = new MongoClient(uri);
    const collection_name = 'Shipment'
    const database = client.db(process.env.DB);
    const collection = database.collection(collection_name);
    
    watchCollection.watchCollection(collection);
  } catch (error) {
    console.error("Error Connecting to Database", error);
  }

process.on('SIGINT', async () => {
    console.log("Closing MongoDB connection");
    await client.close();
    process.exit(0);
  });