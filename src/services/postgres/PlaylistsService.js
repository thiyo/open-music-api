const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const { InvariantError, NotFoundError, AuthenticationError, AuthorizationError } = require("../../exceptions");
const mapDBToModel = require("../../utils");

class PlaylistsService {
    constructor(collaborationsService){
        this._pool = new Pool();
        this._collaborationsService = collaborationsService;
    }

    async addPlaylist({ name, owner }) {
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new Error('Playlist gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getPlaylists(owner){
        const query = {
            text: `SELECT playlists.id, playlists.name, playlists.owner
            FROM playlists
            LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
            WHERE playlists.owner = $1 OR collaborations.playlist_id = $1
            GROUP BY playlists.id`,
            values: [owner],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async verifyPlaylistOwner(playlistId, ownerId) {
        const query = {
          text: 'SELECT * FROM playlists WHERE id = $1',
          values: [playlistId],
        };
        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const playlist = result.rows[0];
        if(playlist.owner !== ownerId){
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    
    async verifyPlaylistAccess(playlistId, userId){
        try {
            await this.verifyPlaylistOwner(playlistId, userId);
        } catch (error) {
            if(error instanceof NotFoundError){
                throw error;
            }

            try {
                await this._collaborationsService.verifyCollaborator(playlistId, userId);
            } catch{
                throw error;
            }
        }
    }

    async getPlaylistById(id){
        const query ={
            text: `SELECT playlists.*, users.username
            FROM playlists
            LEFT JOIN users ON users.id = playlists.owner
            WHERE playlists.id = $1`,
            values: [id],
        }

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        return result.rows[0];
    }

    async deletePlaylistById(id){
        const query = {
            text: 'DELETE FROM playlists WHERE id=$1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError('playlists gagal dihapus. Id tidak ditemukan');
        }
    }

    async isPlaylistExists(playlistId) {
        const query = {
          text: 'SELECT * FROM playlists WHERE id = $1',
          values: [playlistId],
        };
    
        const result = await this._pool.query(query);
    
        if(!result.rows.length){
            throw new NotFoundError('playlist tidak ditemukan');
        }
        return result.rows[0];
    }

    async isSongExists(songId) {
        const query = {
          text: 'SELECT * FROM songs WHERE id = $1',
          values: [songId],
        };
    
        const result = await this._pool.query(query);
    
        if(!result.rows.length){
            throw new NotFoundError('lagu tidak ditemukan');
        }
        return result.rows[0];
    }

    async addSongToPlaylist(playlistId, songId){
        const id = `playlistssongs-${nanoid(16)}`;

        const query ={
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3)',
            values: [id, playlistId, songId],
        };

        await this._pool.query(query);
    }

    async getSongsPlaylistById(playlistId){
        const query = {
            text: `SELECT songs.id, songs.title, songs.performer FROM songs
            LEFT JOIN playlist_songs ON playlist_songs.song_id = songs.id
            WHERE playlist_songs.playlist_id = $1`,
            values: [playlistId],
        }
        const { rows } = await this._pool.query(query);
        
        return rows;
    }

    async deleteSongFromPlaylist(playlistId, songId) {
        const query = {
          text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
          values: [playlistId, songId],
        };
    
        await this._pool.query(query);
    }
}
module.exports = PlaylistsService;