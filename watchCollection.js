const { sendSMS } = require('./sendSMS');

function watchCollection(collection) {
    function startWatching() {
        console.log("Watching for inserts...");

        const changeStream = collection.watch();

        changeStream.on("change", (change) => {
            console.log("Change detected:", change);

            if (change.operationType === 'insert') {
                const { name, phone, status, currentLocation, estimatedDelivery } = change.fullDocument;
                sendSMS(phone, name, status, currentLocation, estimatedDelivery)
                    .then(result => {
                        console.log("SMS Result:", result);
                    })
                    .catch(error => {
                        console.error("Failed to send SMS:", error);
                    });
            }
        });

        changeStream.on("error", (error) => {
            console.error("Error in change stream:", error);
            if (error.message.includes("Use of expired sessions")) {
                console.log("Change stream closed, attempting to reconnect...");
                setTimeout(startWatching, 1000); // Reconnect after 1 second
            }
        });

        changeStream.on("close", () => {
            console.log("Change stream closed, attempting to reconnect...");
            setTimeout(startWatching, 1000); // Reconnect after 1 second
        });
    }

    startWatching();
}

module.exports = { watchCollection };
