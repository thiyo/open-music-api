const { Pool } = require("pg");
const { InvariantError, NotFoundError } = require("../../exceptions");
const { nanoid } = require("nanoid");

class AlbumsService{
    constructor(){
        this._pool = new Pool();
    }

    async addAlbum({name, year}){
        const id = `albums-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
            values: [id, name, year],
        };
        const result = await this._pool.query(query);

        if(!result.rows[0].id){
            throw new InvariantError('Album gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getAlbums(){
        const result = await this._pool.query('SELECT * FROM albums');
        return result;
    }

    async getAlbumById(id) {
        const query = {
          text: 'SELECT id, name, year FROM albums WHERE albums.id = $1',
          values: [id],
        };
    
        const { rows } = await this._pool.query(query);
    
        if (!rows.length) {
          throw new NotFoundError('Album tidaditemukan', 404);
        }

        return rows[0];
      }

    async getAlbumByIdWithSongs(id) {
      const query = {
        text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
        values: [id],
      };
  
      const { rows } = await this._pool.query(query);
  
      if (!rows.length) {
        return rows;
      }      
      return rows;
  }

    async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}
module.exports = AlbumsService;