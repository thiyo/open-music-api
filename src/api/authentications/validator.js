const Joi = require("joi");
const { InvariantError } = require("../../commons/exceptions");


const AuthenticationsValidator = {
    validatePostAuthenticationPayload: (payload) => {

        const PostAuthenticationPayloadSchema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
        });

        const validateResult = PostAuthenticationPayloadSchema.validate(payload);

        if(validateResult.error){
            throw new InvariantError(validateResult.error.message);
        }
    },

    validatePutAuthenticationPayload: (payload) => {
        const PutAuthenticationPayloadSchema = Joi.object({
            refreshToken: Joi.string().required(),
        });

        const validateResult = PutAuthenticationPayloadSchema.validate(payload);

        if(validateResult.error){
            throw new InvariantError(validateResult.error.message);
        }
    },

    validateDeleteAuthenticationPayload: (payload) => {
        const DeleteAuthenticationPayloadSchema = Joi.object({
            refreshToken: Joi.string().required(),
        });
        
        const validateResult = DeleteAuthenticationPayloadSchema.validate(payload);

        if(validateResult.error){
            throw new InvariantError(validateResult.error.message);
        }
    },
};

module.exports= AuthenticationsValidator;