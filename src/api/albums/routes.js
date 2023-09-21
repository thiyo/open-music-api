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
    {
      method: 'POST',
      path: '/albums/{id}/covers',
      handler: (request, res) => handler.postAlbumCoverByIdHandler(request, res),
      options: {
        payload: {
            allow: 'multipart/form-data',
            multipart: true,
            output: 'stream',
            maxBytes: 512000,
        },
      },
    },
    {
      method: 'GET',
      path: '/albums/{id}/covers',
      handler: (request, res) => handler.getAlbumCoverByIdHandler(request, res),
    },
    {
      method: 'POST',
      path: '/albums/{id}/likes',
      handler: (request, res) => handler.postLikeAlbumByIdHandler(request, res),
      options: {
        auth: 'songapp_jwt',
      },
    },
    {
      method: 'GET',
      path: '/albums/{id}/likes',
      handler: (request, res) => handler.getLikeAlbumByIdHandler(request, res),
    },
    {
      method: 'DELETE',
      path: '/albums/{id}/likes',
      handler: (request, res) => handler.deleteLikeAlbumByIdHandler(request, res),
      options: {
        auth: 'songapp_jwt',
      },
    },
];

module.exports = routes;