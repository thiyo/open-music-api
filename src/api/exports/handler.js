  class ExportsHandler {
    constructor(validator, playlistsService, producerService) {
      this._validator = validator;
      this._playlistsService = playlistsService;
      this._producerService = producerService;
    }
  
    async postExportPlaylistHandler(request, res) {
      const { userId } = request.auth.credentials;
      const { playlistId } = request.params;
  
      await this._playlistsService.isPlaylistExists(playlistId);
  
      await this._playlistsService.verifyPlaylistOwner(
        playlistId,
        userId,
      );
  
      this._validator.validatePostExportPlaylistsPayload(request.payload);
  
      const message = {
        playlistId,
        targetEmail: request.payload.targetEmail,
      };

      await this._producerService.sendMessage('export:playlists', JSON.stringify(message));
  
      const response = res.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
      response.code(201);
      return response;
    }
  }
  
  module.exports = ExportsHandler;
  