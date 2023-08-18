// eslint-disable-next-line no-unused-vars
const routes = (handler) => [
    {
        method: 'POST',
        path: '/songs',
        handler: (request, res) => handler.postSongHandler(request, res),
    },
    {
        method: 'GET',
        path: '/songs',
        handler: (request, res) => handler.getSongsHandler(request, res),
    },
    {
        method: 'GET',
        path: '/songs/{id}',
        handler: (request, res) => handler.getSongByIdHandler(request, res),
    },
    {
        method: 'PUT',
        path: '/songs/{id}',
        handler: (request, res) => handler.putSongByIdHandler(request, res),
    },
    {
        method: 'DELETE',
        path: '/songs/{id}',
        handler: (request, res) => handler.deleteSongByIdHandler(request, res),
    },
];

module.exports = routes;