class AlbumsHandler{
    constructor(service, validator){
        this._service = service;
        this._validator = validator;
    }

    async postAlbumHandler(request, res){
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

    async getAlbumByIdHandler(request){
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

    async getAlbumByIdWithSongsHandler(request){
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

    async putAlbumByIdHandler(request){
            this._validator.validateAlbumPayload(request.payload);
            const { name, year } = request.payload;
            const {id} = request.params;

            await this._service.editAlbumById(id, {name, year});
            return{
                status: 'success',
                message: 'Album berhasil diperbarui',
            };
    }

    async deleteAlbumByIdHandler(request){
            const {id} = request.params;
            await this._service.deleteAlbumById(id);
            return{
                status: 'success',
                message: 'Album berhasil dihapus',
            };
        }
}
module.exports = AlbumsHandler;