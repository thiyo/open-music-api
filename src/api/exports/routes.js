// eslint-disable-next-line no-unused-vars
const routes = (handler) => [
    {
      method: 'POST',
      path: '/export/playlists/{playlistId}',
      handler: (request, res) => handler.postExportPlaylistHandler(request, res),
      options: {
        auth: 'songapp_jwt',
      },
    },
  ];
   
  module.exports = routes;