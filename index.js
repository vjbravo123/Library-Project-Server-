const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 5000;
const corsOption = {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOption));
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// MongoDB setup
// const mongoUri = 'mongodb://localhost:27017'; 
const mongoUri = 'mongodb+srv://Vivek:67NrptwoV6nRTXAx@library.nvvkq01.mongodb.net/';
const client = new MongoClient(mongoUri);

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Could not connect to MongoDB", error);
    }
}

connectDB();

app.get("/", (req, res) => {
    console.log("Request received");
    res.send({"success": "success"});
});

app.get('/api/books/images', (req, res) => {
    const imagesDirectory = path.join(__dirname, 'images');

    fs.readdir(imagesDirectory, (err, files) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error reading image directory' });
        }

        const fileUrls = files.map(file => ({
            url: `http://localhost:${PORT}/images/${file}`
        }));
    
        res.json(fileUrls);
    });
});

app.get('/api/books/pdf/:id', async (req, res) => {
    try {
        const db = client.db("Library");
        const collection = db.collection("books");

        const book = await collection.findOne({ _id: new ObjectId(req.params.id) });

        if (!book || !book.pdf) {
            return res.status(404).send('No book found with the given ID or PDF is missing.');
        }

        // Assuming the PDF is stored in a Binary field in MongoDB
        const pdfBuffer = book.pdf.buffer; // Access the buffer of the binary data

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="' + book.title.replace(/[^a-zA-Z0-9]/g,'_') + '.pdf"'); // Replace non-alphanumeric to ensure filename is valid
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Failed to fetch PDF:', error);
        res.status(500).send('Failed to fetch PDF');
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`);
});
