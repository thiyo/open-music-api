const Joi = require('joi');
const { InvariantError } = require('../../exceptions');

const SongsValidator = {
  validateSongPayload: (payload) => {
    const currentYear = new Date().getFullYear();
    const schema = Joi.object({
        title: Joi.string().required(),
        year: Joi.number().integer().min(1900).max(currentYear).required(),
        genre: Joi.string().required(),
        performer: Joi.string().required(),
        duration: Joi.number(),
        albumId: Joi.string(),
    });

    const result = schema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }

    return result.value;
  }
}

module.exports = SongsValidator;
