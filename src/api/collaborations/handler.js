const { ForbiddenError, NotFoundError } = require("../../exceptions");

class CollaborationsHandler{
    constructor(collaborationsService, playlistsService, usersService, validator){
        this._collaborationsService = collaborationsService;
        this._playlistsService = playlistsService;
        this._usersService = usersService;
        this._validator = validator;
    }

    async postCollaborationHandler(request, res){
        const { userId: owner } = request.auth.credentials;
        this._validator.validateCollaborationPayload(request.payload);
        const { playlistId, userId } = request.payload;

        await this._playlistsService.verifyPlaylistAccess(playlistId, owner);

        await this._usersService.getUserById(userId);

        const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

        const response = res.response({
            status: 'success',
            message: 'Kolaborasi berhasil ditambahkan',
            data: {
                collaborationId,
            },
        });
        
        response.code(201);
        return response;
    }

    async deleteCollaborationHandler(request, res){
        this._validator.validateCollaborationPayload(request.payload);
        const { userId: userCredentials } = request.auth.credentials;
        const { playlistId, userId } = request.payload;

        await this._playlistsService.verifyPlaylistOwner(playlistId, userCredentials);
        await this._collaborationsService.deleteCollaboration(playlistId, userId);

        return {
            status: 'success',
            message: 'Kolaborasi berhasil dihapus',
        };
    }
    
}
module.exports = CollaborationsHandler;