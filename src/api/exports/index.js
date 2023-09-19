const ExportsHandler = require('./handler');
const ExportsValidator = require('./validator');
const routes = require('./routes');

const _exports = {
  name: 'exports',
  register: async (server, { playlistsService, producerService }) => {
    const exportsHandler = new ExportsHandler(
      ExportsValidator,
      playlistsService,
      producerService,
    );

    server.route(routes(exportsHandler));
  },
};

module.exports = _exports;


