const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const { InvariantError, NotFoundError, AuthenticationError, AuthorizationError } = require("../../exceptions");
const mapDBToModel = require("../../utils");

class PlaylistsService {
    constructor(){
        this._pool = new Pool();
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
            text: `SELECT playlists.id, playlists.name, users.username
            FROM playlists
            LEFT JOIN users ON users.id = playlists.owner
            WHERE playlists.owner = $1`,
            values: [owner],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async verifyPlaylistOwner(id, owner){
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1 AND owner =$2',
            values: [id, owner],
        };

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        // const playlist = result.rows[0];
        // if(playlist.owner !== owner){
        //     throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        // }
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
            text: 'DELETE FROM notes WHERE id=$1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
        }
    }

    async postSongToPlaylist(songId, playlistId){
        const id = `collab-${nanoid(16)}`;

        const query ={
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, songId, playlistId],
        };

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new InvariantError('Lagu gagal ditambahkan ke playlist');
        }
        return result.rows[0].id;
    }

    async getSongsPlaylistById(playlistId){
        const query = {
            text: `SELECT songs.* FROM songs
            LEFT JOIN playlist_songs ON playlist_songs.song_id = songs.id
            WHERE playlist_songs.playlist_id = $1`,
            values: [playlistId],
        }
        const { rows } = await this._pool.query(query);
        
        return rows;
    }
}
module.exports = PlaylistsService;