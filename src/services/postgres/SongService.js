const { Pool } = require("pg");
const { InvariantError, NotFoundError } = require("../../exceptions");
const { nanoid } = require("nanoid");

class SongsService{
    constructor(){
        this._pool = new Pool();
    }

    async addSong({title, year, genre, performer, duration, albumId}){
        const id = `songs-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            values: [id, title, year, genre, performer, duration, albumId],
        };
        const result = await this._pool.query(query);

        if(!result.rows[0].id){
            throw new InvariantError('Lagu gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getSongs(){
      const query = 'SELECT id, title, performer FROM songs';
      const { rows } = await this._pool.query(query);
      return rows;
    }
    

    async getSongsByTitle(title) {
      const query = {
        text: 'SELECT * FROM songs WHERE title LIKE $1',
        values: [`%${title}%`],
      };
      const result = await this._pool.query(query);
      return result.rows;
    }


    async getSongById(id) {
        const query = {
          text: 'SELECT * FROM songs WHERE id = $1',
          values: [id],
        };
    
        const { rows } = await this._pool.query(query);
    
        if (!rows.length) {
          throw new NotFoundError('Lagu tidak ditemukan', 404);
        }
    
        return rows[0];
    }

    async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}
module.exports = SongsService;