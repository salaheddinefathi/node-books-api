const ImageKit = require('imagekit');
const path = require('path');

// Njarrbo n-load-iu .env men l-parent folder hit fih l-.env
require('dotenv').config({ path: path.join(__dirname, '../.env') });

if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
    console.error('❌ CRITICAL ERROR: ImageKit credentials missing in environment variables!');
    console.error('Please check your .env file or deployment settings (IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT)');
}

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || ''
});

module.exports = imagekit;
