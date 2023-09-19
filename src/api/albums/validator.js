const Joi = require('joi');
const { InvariantError } = require('../../commons/exceptions');

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
  },
  
  validatePutAlbumCoverPayload: (payload) => {
    const scheme = Joi.object({
      cover: Joi.object({
        hapi: Joi.object({
          filename: Joi.string().required(),
          headers: Joi.object({
            'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
          }).unknown(),
        }).unknown(),
      }).unknown().required(),
    });

    const result = scheme.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }

    return result.value;
  },
}

module.exports = AlbumsValidator;
