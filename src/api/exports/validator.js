const Joi = require('joi');
const { InvariantError } = require('../../commons/exceptions');
 
const ExportPlaylistsPayloadSchema = Joi.object({
    targetEmail: Joi.string().email().required(),
});


const ExportsValidator = {
    validatePostExportPlaylistsPayload: (payload) => {

    const validationResult = ExportPlaylistsPayloadSchema.validate(payload);
 
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
 
module.exports = ExportsValidator;