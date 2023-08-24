const routes = (handler) => [
    {
        method: 'POST',
        path: '/users',
        handler: (request, res) => handler.postUserHandler(request, res),
    },
    {
        method: 'GET',
        path: '/users/{id}',
        handler: (request, res) => handler.getUserByIdHandler(request, res),
    }
];
module.exports = routes;