const { ForbiddenError, NotFoundError } = require("../../exceptions");

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

    async postSongToPlaylistHandler(request, res){
        const { playlistId } = request.params;
        const { songId } = this._validator.validatePostPlaylistSongPayload(request.payload);
        const { userId: owner } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, owner);
        
        await this._service.isSongExists(songId);
        
        await this._service.addSongToPlaylist(playlistId, songId);

        const response = res.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan ke playlist',
        });
        response.code(201);
        return response;
    }

    async getSongFromPlaylistHandler(request){
        const { playlistId } = request.params;
        const { userId: owner } = request.auth.credentials;

        await this._service.isPlaylistExists(playlistId);
        
        await this._service.verifyPlaylistAccess(playlistId, owner);

        const playlist = await this._service.getPlaylistById(playlistId);
        const songs = await this._service.getSongsPlaylistById(playlistId);

        return {
            status: 'success',
            data: {
                playlist: {
                    ...playlist,
                    songs,
                },
            },
        };
    }

    async deleteSongFromPlaylistHandler(request){
        const { playlistId } = request.params;
        const { songId } = this._validator.validatePostPlaylistSongPayload(request.payload);
        const { userId: owner } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, owner);
        
        await this._service.deleteSongFromPlaylist(playlistId, songId);
        
        return {
            status: 'success',
            message: 'Lagu berhasil dihapus dari playlist',
        };
    }

}
module.exports = PlaylistsHandler;