const { config } = require("../../commons/config");

class AlbumsHandler{
    constructor(service, validator, storageService, userAlbumLikesService){
        this._service = service;
        this._validator = validator;
        this._storageService = storageService;
        this._userAlbumLikesService = userAlbumLikesService;
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
                        ...album,
                        songs,
                    }
                },
            };
    }

    // async getAlbumByIdWithSongsHandler(request){
    //         const {id} = request.params;
    //         const album = await this._service.getAlbumById(id);
    //         const songs = await this._service.getAlbumByIdWithSongs(id);
    //         return{
    //             status: 'success',
    //             data: {
    //                album:{
    //                  ...album,
    //                  songs,
    //                }
    //             },
    //         };
    // }

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

    async postAlbumCoverByIdHandler(request, res){
        const {id: albumId} = request.params;
        const { cover } = this._validator.validatePutAlbumCoverPayload(request.payload);
        const fileExtension = cover.hapi.filename.split('.').pop();

        const filename = await this._storageService.saveAlbumArt(albumId, cover, fileExtension);

        await this._service.setCoverUrlToAlbum(albumId, filename);
           
        const response = res.response({
            status: 'success',
            message: 'Sampul berhasil diunggah',
        });
        response.code(201);
        return response;
    }

    async getAlbumCoverByIdHandler(request, res) {
        const { id: albumId } = request.params;
    
        await this._service.isAlbumExist(albumId);
    
        const coverFile = await this._service.getCoverAlbumById(albumId);
    
        if (!coverFile) {
          throw new NotFoundError('cover tidak ditemukan');
        }
    
        const filePath = join(config.server.imagesPublicPath, coverFile);

       
        return res.file(filePath)
    }

    async postLikeAlbumByIdHandler(request, res) {
      const { userId } = request.auth.credentials;
        const { id: albumId } = request.params;
    
        await this._service.isAlbumExist(albumId);

        const isLiked = await this._userAlbumLikesService.isUserAlreadyLikedAlbum(userId, albumId);
        
        if (isLiked) {
          throw new InvariantError('Album sudah disukai');
        }

        await this._userAlbumLikesService.persistUserAlbumLike(userId, albumId);
    
        const response = res.response({
          status: 'success',
          message: 'Album berhasil disukai',
        });
        response.code(201);
        return response; 
    }
    
    async getLikeAlbumByIdHandler(request, res) {
       const { id: albumId } = request.params;
    
       const isExist = await this._service.isAlbumExist(albumId);
    
       if (!isExist) {
         throw new NotFoundError('Album tidak ditemukan');
       }
    
       const { source, count } = await this._userAlbumLikesService.countLikesByAlbumId(albumId);
    
       const response = res.response({
         status: 'success',
         data: {
           likes: count,
         },
       });
       response.header('X-Data-Source', source);
       return response;
    }
    
    async deleteLikeAlbumByIdHandler(request) {
       const { id: albumId } = request.params;
       const { userId } = request.auth.credentials;
    
       const isExist = await this._service.isAlbumExist(albumId);
    
       if (!isExist) {
         throw new NotFoundError('Album tidak ditemukan');
       }
    
       await this._userAlbumLikesService.deleteUserAlbumLike(userId, albumId);
    
       return {
         status: 'success',
         message: 'Album berhasil dihapus dari daftar suka',
       };
    }
}
module.exports = AlbumsHandler;