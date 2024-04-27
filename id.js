const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://Vivek:67NrptwoV6nRTXAx@library.nvvkq01.mongodb.net/';

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected successfully to server");

    // Use the correct case for the database name that already exists
    const db = client.db('Library');
    const collection = db.collection('books');

    // Query to get the ObjectIDs, titles, and thumbnails of all documents
    // Include the thumbnail field in the projection
    const cursor = collection.find({}, { projection: { _id: 1, title: 1, thumbnail: 1 } });
    const documents = await cursor.toArray();
    console.log('ObjectIDs, titles, and thumbnails of all documents:', documents);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.error);
