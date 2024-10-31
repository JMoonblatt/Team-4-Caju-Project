
const query = require("./query.js");

async function watchCollection(collection) {

  try {

    // Set up change stream to watch for inserts
    const changeStream = collection.watch([{ $match: { 'operationType': 'insert' } }]);

    // Set up listener to handle the change event
    changeStream.on('change', (change) => {
      if (collection.collectionName === 'Shipment') {
        query.findUser(change, collection);
      }
    });

    console.log("Watching for inserts...");
    
    changeStream.on('close', async () => {
        console.log("Change stream closed, attempting to reconnect...");
        await watchCollection(collection);
      });
  } catch (error) {
    console.error("Error watching collection:", error);
  }

  
}

function handleShipmentDocument(change) {
  console.log('New document inserted:', change.fullDocument);
  const locations = change.fullDocument.origins.push(change.fullDocument.destination);
  return locations;
  // query.findUser(locations, collection)
  // console.log(change.fullDocument.origins);
  // console.log(change.fullDocument.destination);
}

module.exports = { watchCollection };
