class AlbumsHandler{
    constructor(service, validator){
        this._service = service;
        this._validator = validator;
    }

    async postAlbumHandler(request, res){
        // try {
            this._validator.validateAlbumPayload(request.payload);
            const { name, year } = request.payload;
            const albumId = await this._service.addAlbum({name, year});

            const response = res.response({
                status: 'success',
                message: 'Album berhasil ditambahkan',
                data:{
                    albumId,
                },
            });
            response.code(201);
            return response;

        // } catch (error) {
        //     if(error instanceof ClientError){
        //         const response = res.response({
        //             status: 'fail',
        //             message: error.message,
        //         });
        //         response.code(error.statusCode);
        //         return response;
        //     }

        //     //server error
        //     const response = res.response({
        //         status: 'error',
        //         message: 'Maaf, terjadi kesalahan pada server kami.'
        //     });

        //     response.code(500);
        //     console.error(error);
        //     return response;
        // }
    }

    async getAlbumsHandler(){
        const albums = await this._service.getAlbums();
        return{
            status: 'success',
            data:{
                albums,
            },
        }
    }

    async getAlbumByIdHandler(request, res){
            const {id} = request.params;
            const album = await this._service.getAlbumById(id);
            const songs = await this._service.getAlbumByIdWithSongs(id);
            return{
                status: 'success',
                data: {
                   album:{
                     id: album.id,
                     name: album.name,
                     year: album.year,
                     songs,
                   }
                },
            };
    }

    async getAlbumByIdWithSongsHandler(request, res){
            const {id} = request.params;
            const album = await this._service.getAlbumById(id);
            const songs = await this._service.getAlbumByIdWithSongs(id);
            return{
                status: 'success',
                data: {
                   album:{
                     id: album.id,
                     name: album.name,
                     year: album.year,
                     songs,
                   }
                },
            };
    }

    async putAlbumByIdHandler(request, res){
            this._validator.validateAlbumPayload(request.payload);
            const { name, year } = request.payload;
            const {id} = request.params;

            await this._service.editAlbumById(id, {name, year});
            return{
                status: 'success',
                message: 'Album berhasil diperbarui',
            };
    }

    async deleteAlbumByIdHandler(request, res){
            const {id} = request.params;
            await this._service.deleteAlbumById(id);
            return{
                status: 'success',
                message: 'Album berhasil dihapus',
            };
        }
}
module.exports = AlbumsHandler;