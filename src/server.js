require('dotenv').config();
const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const songs = require('./api/songs');
const AlbumsValidator = require('./api/albums/validator');
const SongsValidator = require('./api/songs/validator');
const AlbumsService = require('./services/postgres/AlbumService');
const SongsService = require('./services/postgres/SongService');
const { ClientError } = require('./exceptions');

const init =async() =>{
    const albumsService = new AlbumsService();
    const songsService = new SongsService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin:  ['*'],
            },
        },
    });
    await server.register({
       plugin: albums,
       options: {
         service: albumsService,
         validator: AlbumsValidator,
       },
    });
    await server.register({
        plugin: songs,
        options: {
            service: songsService,
            validator: SongsValidator,
        },
    });

    server.ext('onPreResponse', (request, h) => { 
        // mendapatkan konteks response dari request 
        const { response } = request; 
        if (response instanceof ClientError) { 
        // membuat response baru dari response toolkit sesuai kebutuhan error handling 
        const newResponse = h.response({ 
            status: 'fail', 
            message: response.message, 
        }); 
        newResponse.code(response.statusCode); 
        return newResponse; } 
        // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi) 
        return response.continue || response; 
    });
    
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init(); 