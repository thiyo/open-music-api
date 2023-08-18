const Joi = require('joi');
const { InvariantError } = require('../../exceptions');

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
  const currentYear = new Date().getFullYear();
    const schema = Joi.object({
      name: Joi.string().required(),
      year: Joi.number().integer().min(1900).max(currentYear).required(),
    });

    const result = schema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }

    return result.value;
  }
}

module.exports = AlbumsValidator;
