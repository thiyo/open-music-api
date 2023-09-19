const fs = require('fs');
const {config} = require('../../commons/config')
 
class StorageService {
  constructor(folder) {
    this._folder = folder;
    if (!fs.existsSync(config.server.imagesPublicPath)) {
      fs.mkdirSync(config.server.imagesPublicPath, { recursive: true });
    }
  }

  saveAlbumArt(albumId, albumArt, fileExtension) {
    return new Promise((resolve, reject) => {
      const filename = `${albumId}.${fileExtension}`;
      const filePath = `${config.app.imagesPublicPath}/${filename}`;
      const writable = fs.createWriteStream(filePath);

      albumArt.pipe(writable);

      writable.on('finish', () => {
        resolve(filename);
      });

      writable.on('error', (err) => {
        reject(err);
      });
    });
  }
}

module.exports = StorageService;