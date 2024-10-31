const { sendSMS } = require('./sendSMS');

function watchCollection(collection, logCallback) {
    const changeStream = collection.watch();

    changeStream.on('change', (change) => {
        console.log("Change detected:", change);

        if (change.operationType === 'update' && change.updateDescription.updatedFields.status) {
            const { name, phone, status, currentLocation, estimatedDelivery } = change.fullDocument;

            // Call sendSMS function
            sendSMS(phone, name, status, currentLocation, estimatedDelivery)
                .then(result => {
                    console.log("SMS Result:", result);

                    // Call logCallback to log to audit trail
                    const messageDetails = {
                        message: `SMS sent to ${phone} about shipment status update.`,
                        to: phone,
                        status: 'Sent'
                    };
                    logCallback(messageDetails);
                })
                .catch(error => {
                    console.error("Failed to send SMS:", error);

                    // Log the failure in the audit trail
                    const messageDetails = {
                        message: `Failed to send SMS to ${phone}.`,
                        to: phone,
                        status: 'Failed'
                    };
                    logCallback(messageDetails);
                });
        }
    });
}

module.exports = { watchCollection };
