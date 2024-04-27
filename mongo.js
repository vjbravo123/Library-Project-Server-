const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB connection string
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
  
      // PDF file path
      const pdfPath = path.join(__dirname, 'books', 'TKMFullText.pdf');
      const pdfData = fs.readFileSync(pdfPath);
  
      // Metadata
      const metadata = {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        _id: new ObjectId()  // Unique ID for the document
      };
  
      // Insert PDF with metadata into the database
      const insertResult = await collection.insertOne({
        ...metadata,
        pdf: pdfData
      });
      console.log('Inserted document ID:', insertResult.insertedId);
  
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  
  run().catch(console.error);
