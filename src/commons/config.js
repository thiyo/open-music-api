const dotenv = require('dotenv');
const { join } = require('path');

dotenv.config();

const config ={
    server: {
        host: process.env.HOST,
        port: process.env.PORT,
        imagesPublicPath: join(process.cwd(), 'src', 'public', 'images'),
        generateAlbumArtUrl: (albumId) => `http://${process.env.HOST}:${process.env.PORT}/albums/${albumId}/covers`,
    }
}

module.exports = { config };