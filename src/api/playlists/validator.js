const Joi = require('joi');
const { InvariantError } = require('../../commons/exceptions');

const PlaylistsValidator = {
  validatePostPlaylistPayload: (payload) => {
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    const validationResult = schema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },

  validatePostPlaylistSongPayload: (payload) => {
    const schema = Joi.object({
      songId: Joi.string().required(),
    });

    const validationResult = schema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
};

module.exports = PlaylistsValidator;

