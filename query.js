function findUser(change) {
    // Check if fullDocument, origins array, and destination field exist before using them
    if (change.fullDocument && Array.isArray(change.fullDocument.origins) && change.fullDocument.destination) {
        // Add destination to the origins array to get a full route
        const locations = [...change.fullDocument.origins, change.fullDocument.destination];
        return locations;
    } else {
        console.error("Document structure is unexpected or missing required fields:", change.fullDocument);
        return null;
    }
}

module.exports = { findUser };
