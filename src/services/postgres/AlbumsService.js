const { Pool } = require("pg");
const { InvariantError, NotFoundError } = require("../../commons/exceptions");
const { nanoid } = require("nanoid");
const { config } = require("../../commons/config");

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
          text: 'SELECT id, name, year, cover_file FROM albums WHERE albums.id = $1',
          values: [id],
        };
    
        const { rows } = await this._pool.query(query);
    
        if (!rows.length) {
          throw new NotFoundError('Album tidak ditemukan', 404);
        }
        return {
          id: rows[0].id,
          name: rows[0].name,
          year: rows[0].year,
          coverUrl: rows[0].cover_file !== null ? `${config.server.generateAlbumArtUrl(id)}` : null,
        };
      }

    async getAlbumByIdWithSongs(id) {
      const query = {
        text: 'SELECT id, title, performer FROM songs WHERE "album_id" = $1',
        values: [id],
      };
  
      const { rows } = await this._pool.query(query);
  
      if (!rows.length) {
        return rows;
      }      
      return rows;
  }

  async setCoverUrlToAlbum(albumId, filename) {
    const query = {
      text: 'UPDATE albums SET cover_file = $1 WHERE id = $2 RETURNING id',
      values: [filename, albumId],
    };

    await this._pool.query(query);
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

  async isAlbumExist(id) {
    const query = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    
    if (!rows.length) {
      throw new NotFoundError('Album tidak ditemukan', 404);
    }
    return {
      id: rows[0].id,
      name: rows[0].name,
      year: rows[0].year,
      coverUrl: rows[0].cover_file !== null ? `${config.server.generateAlbumArtUrl(id)}` : null,
    };
  }

  async getCoverAlbumById(id) {
    const query = {
      text: 'SELECT cover_file FROM albums WHERE id = $1',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      return null;
    }

    return rows[0].cover_file;
  }
}


module.exports = AlbumsService;