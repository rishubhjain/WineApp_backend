// import { v2 as cloudinary } from 'cloudinary'

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config()

const app = express();
const PORT = 4000;
app.use(cors());

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Function to upload the file to Cloudinary
const uploadFile = async (filepath) => {
    try {
        const result = await cloudinary.uploader.upload(filepath);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// Route to handle image upload
app.post('/upload', upload.single('image'), async (req, res) => {

    console.log("req came")
    console.log(req)

    // if (req.body.image) res.send({ message: 'File uploaded successfully', url: req.body.image });

    try {
        const imagePath = req.file.path; // This is the path where Multer saved the image
        console.log("Image path:", imagePath);

        // Check if file exists
        if (!fs.existsSync(imagePath)) {
            console.error('File not found:', imagePath);
            return res.status(400).send('Error: File not found');
        }

        // Upload the file to Cloudinary
        const imageResult = await uploadFile(imagePath);
        console.log("Cloudinary URL:", imageResult.url);

        // Send the Cloudinary URL back to the client
        res.send({ message: 'File uploaded successfully', url: imageResult.url });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Error uploading file.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
