const { ClientError } = require("../../exceptions");

class SongsHandler{
    constructor(service, validator){
        this._service = service;
        this._validator =validator;
    }

    async postSongHandler(request, res){
            this._validator.validateSongPayload(request.payload);
            const songId = await this._service.addSong(request.payload);

            const response = res.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan',
                data: {
                    songId,
                },
            });
            response.code(201);
            return response;
    }
    
    async getSongsHandler(request, res){

        try {
            const {title = '', performer = ''} = request.query;
                const songs = await this._service.getSongsByTitle(title, performer);
                return{
                    status: 'success',
                    data:{
                        songs,
                    },
            }
        } catch (error) {
            if(error instanceof ClientError){
                const response = res.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            
            const songs = await this._service.getSongs();
                return{
                    status: 'success',
                    data:{
                        songs,
                    },
                }
            
        }
        
    }

    async getSongByIdHandler(request, res){
            const {id} = request.params;
            const song = await this._service.getSongById(id);
            return{
                status: 'success',
                data:{
                    song,
                },
            };
    }

    
    // async getSongByKeywordHandler(request, res){
    //     const {kw} = request.query.keyword;
    //     const songs = await this._service.getSongsByKeyword(kw);
    //     return{
    //         status: 'success',
    //         data:{
    //             songs,
    //         },
    //     };
    // }

    async putSongByIdHandler(request, res){
            this._validator.validateSongPayload(request.payload);
            const {title, year, genre, performer, duration, albumId} = request.payload;
            const  {id} = request.params;
            
            await this._service.editSongById(id, {title, year, genre, performer, duration, albumId});
            return{
                status:'success',
                message: 'Lagu berhasil diperbarui',
            }
    }

    async deleteSongByIdHandler(request, res){
            const {id} =request.params;
            await this._service.deleteSongById(id);
            return{
                status: 'success',
                message: 'Lagu berhasil dihapus',
            };
    }
}
module.exports = SongsHandler;