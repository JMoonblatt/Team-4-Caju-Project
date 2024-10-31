function findUser(change, collection) {
    const locations = change.fullDocument.origins.push(change.fullDocument.destination);
    console.log(locations[1]);
}

module.exports = { findUser }