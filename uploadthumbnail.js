const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB connection string and client setup
const uri = 'mongodb+srv://Vivek:67NrptwoV6nRTXAx@library.nvvkq01.mongodb.net/';
const client = new MongoClient(uri);

// Directory containing the thumbnail images
const thumbnailsDir = path.join(__dirname, 'images');

async function uploadThumbnails() {
    try {
        await client.connect();
        const database = client.db('Library');
        const books = database.collection('books');

        // Read all files in the thumbnail directory
        const files = fs.readdirSync(thumbnailsDir);

        for (const file of files) {
            const objectId = file.split('.')[0];
            const filePath = path.join(thumbnailsDir, file);
            const thumbnailData = fs.readFileSync(filePath);

            // Convert image data to a base64 string
            const base64Thumbnail = thumbnailData.toString('base64');

            // Update the corresponding book document
            const updateResult = await books.updateOne(
                { _id: new ObjectId(objectId) },
                { $set: { thumbnail: base64Thumbnail } }
            );

            console.log(`Updated ${updateResult.matchedCount} document(s)`);
        }
    } catch (err) {
        console.error('Failed to upload thumbnails:', err);
    } finally {
        await client.close();
    }
}

uploadThumbnails();
