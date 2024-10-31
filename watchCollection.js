const { sendSMS } = require('./sendSMS');

function watchCollection(collection) {
  const changeStream = collection.watch();

  changeStream.on('change', (change) => {
    console.log("Change detected:", change);
    
    if (change.operationType === 'update' && change.updateDescription.updatedFields.status) {
      const { name, phone, status, currentLocation, estimatedDelivery } = change.fullDocument;
      
      // Call sendSMS function
      sendSMS(phone, name, status, currentLocation, estimatedDelivery)
        .then(result => {
          console.log("SMS Result:", result);
        })
        .catch(error => {
          console.error("Failed to send SMS:", error);
        });
    }
  });
}

module.exports = { watchCollection };
