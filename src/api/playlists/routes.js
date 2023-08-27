// eslint-disable-next-line no-unused-vars
const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: (request, res) => handler.postPlaylistHandler(request, res),
        options: {
          auth: 'songapp_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: (request) => handler.getPlaylistsHandler(request),
        options: {
          auth: 'songapp_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: (request) => handler.deletePlaylistByIdHandler(request),
        options: {
          auth: 'songapp_jwt',
        },
    },
    {
        method: 'POST',
        path: '/playlists/{playlistId}/songs',
        handler: (request, res) => handler.postSongToPlaylistHandler(request, res),
        options: {
          auth: 'songapp_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{playlistId}/songs',
        handler: (request) => handler.getSongFromPlaylistHandler(request),
        options: {
          auth: 'songapp_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{playlistId}/songs',
        handler: (request) => handler.deleteSongFromPlaylistHandler(request),
        options: {
          auth: 'songapp_jwt',
        },
    },
];

module.exports = routes;