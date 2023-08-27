require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const { ClientError } = require('./exceptions');

//albums
const albums = require('./api/albums');
const AlbumsValidator = require('./api/albums/validator');
const AlbumsService = require('./services/postgres/AlbumsService');

//songs
const songs = require('./api/songs');
const SongsValidator = require('./api/songs/validator');
const SongsService = require('./services/postgres/SongsService');

//users
const users = require('./api/users');
const UsersValidator = require('./api/users/validator');
const UsersService = require('./services/postgres/UsersService');

//playlist
const playlists = require('./api/playlists');
const PlaylistsValidator = require('./api/playlists/validator');
const PlaylistsService = require('./services/postgres/PlaylistsService');

//authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/tokenManager');
const AuthenticationsValidator=require('./api/authentications/validator');

//collaborations
const collaborations = require('./api/collaborations');
const CollaborationsValidator = require('./api/collaborations/validator');
const CollaborationsService = require('./services/postgres/CollaborationsService');


const init =async() =>{
    const albumsService = new AlbumsService();
    const songsService = new SongsService();
    const usersService = new UsersService();
    const collaborationsService = new CollaborationsService();
    const playlistsService = new PlaylistsService(collaborationsService);
    const authenticationsService = new AuthenticationsService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin:  ['*'],
            },
        },
    });

    //regist plugin eksternal
    await server.register([
        {
            plugin: Jwt,
        },
    ]);
    
    // mendefinisikan strategy autentikasi jwt
    server.auth.strategy('songapp_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
        aud: false,
        iss: false,
        sub: false,
        maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
        isValid: true,
        credentials: {
            userId: artifacts.decoded.payload.id,
        },
        }),
    });

    //regist plugin internal
    await server.register([
    {
       plugin: albums,
       options: {
         service: albumsService,
         validator: AlbumsValidator,
       },
    },
    {
        plugin: songs,
        options: {
            service: songsService,
            validator: SongsValidator,
        },
    },
    {
        plugin: users,
        options: {
            service: usersService,
            validator: UsersValidator,
        },
    },
    {
        plugin: authentications,
        options: {
            authenticationsService,
            usersService,
            tokenManager: TokenManager,
            validator: AuthenticationsValidator,
        },
    },
    {
        plugin: playlists,
        options: {
            service: playlistsService,
            validator: PlaylistsValidator,
        },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: CollaborationsValidator,
      },
    },
    ]);

    server.ext('onPreResponse', (request, res) => { 
        // mendapatkan konteks response dari request 
        const { response } = request; 
        if (response instanceof ClientError) { 
        // membuat response baru dari response toolkit sesuai kebutuhan error handling 
        const newResponse = res.response({ 
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