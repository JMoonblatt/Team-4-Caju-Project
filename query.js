function findUser(change) {
    // Check if fullDocument and the necessary fields exist before accessing them
    if (change.fullDocument && change.fullDocument.origins && change.fullDocument.destination) {
        const locations = change.fullDocument.origins.push(change.fullDocument.destination);
        return locations;
    } else {
        console.error("Document structure is unexpected:", change.fullDocument);
        return null;
    }
}

module.exports = { findUser };
