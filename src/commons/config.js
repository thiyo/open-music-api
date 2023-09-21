const dotenv = require('dotenv');
const { join } = require('path');

dotenv.config();

const config ={
    server: {
        host: process.env.HOST,
        port: process.env.PORT,
        imagesPublicPath: join(process.cwd(), 'src', 'public', 'images'),
        generateAlbumArtUrl: (albumId) => `http://${process.env.HOST}:${process.env.PORT}/albums/${albumId}/covers`,
    },
    postgres: {
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE,
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    },
    redis: {
      url: process.env.REDIS_SERVER,
    },
}


module.exports = { config };