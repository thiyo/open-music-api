class PlaylistsHandler{
    constructor(service, validator){
        this._service = service;
        this._validator = validator;
    }

    async postPlaylistHandler(request, res){
        
        const { userId: owner } = request.auth.credentials;
        const { name } = this._validator.validatePostPlaylistPayload(request.payload);

        const playlistId = await this._service.addPlaylist({ name, owner });

        const response = res.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: {
                playlistId,
            },
        });
        response.code(201);
        return response;
    }

    async getPlaylistsHandler(request){
        const { userId: owner } = request.auth.credentials;
        const playlists = await this._service.getPlaylists(owner);
        return{
            status: 'success',
            data: {
                playlists,
            },
        };
    }

    async deletePlaylistByIdHandler(request){
        const {id} = request.params;
        const { userId: owner } = request.auth.credentials;
        
        await this._service.verifyPlaylistOwner(id, owner);
        await this._service.deletePlaylistById(id);
        
        return{
            status: 'success',
            message: 'Catatan berhasil dihapus',
        };
    }
}
module.exports = PlaylistsHandler;