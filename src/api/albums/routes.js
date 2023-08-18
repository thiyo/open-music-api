// eslint-disable-next-line no-unused-vars
const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums',
        handler: (request, res) => handler.postAlbumHandler(request, res),
    },
    {
        method: 'GET',
        path: '/albums',
        handler: (request, res) => handler.getAlbumsHandler(request, res),
    },
    {
        method: 'GET',
        path: '/albums/{id}',
        handler: (request, res) =>handler.getAlbumByIdHandler(request, res),
    },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler: (request, res) =>handler.putAlbumByIdHandler(request, res),
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: (request, res) =>handler.deleteAlbumByIdHandler(request, res),
    },
];

module.exports = routes;