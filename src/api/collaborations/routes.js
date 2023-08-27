// eslint-disable-next-line no-unused-vars
const routes = (handler) => [
    {
      method: 'POST',
      path: '/collaborations',
      handler: (request, res) => handler.postCollaborationHandler(request, res),
      options: {
        auth: 'songapp_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/collaborations',
      handler: (request, res) => handler.deleteCollaborationHandler(request, res),
      options: {
        auth: 'songapp_jwt',
      },
    },
  ];
   
  module.exports = routes;