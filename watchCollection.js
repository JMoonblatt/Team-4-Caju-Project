
async function watchCollection(collection) {

  try {

    // Set up change stream to watch for inserts
    const changeStream = collection.watch([{ $match: { 'operationType': 'insert' } }]);

    // Set up listener to handle the change event
    changeStream.on('change', (change) => {
      return change;
      //handleNewDocument(change);
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

function handleNewDocument(change) {
  console.log('New document inserted:', change.fullDocument)
  return change;
}

module.exports = { watchCollection };