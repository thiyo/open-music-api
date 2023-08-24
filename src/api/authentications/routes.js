const routes = (handler) => [
    {
      method: 'POST',
      path: '/authentications',
      handler: (request, res) => handler.postAuthenticationHandler(request, res),
    },
    {
      method: 'PUT',
      path: '/authentications',
      handler: (request, res) => handler.putAuthenticationHandler(request, res),
    },
    {
      method: 'DELETE',
      path: '/authentications',
      handler: (request, res) => handler.deleteAuthenticationHandler(request, res),
    },
  ];
   
  module.exports = routes;