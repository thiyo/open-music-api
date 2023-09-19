const Joi = require("joi");
const { InvariantError } = require("../../commons/exceptions");

const UserValidator = {
    validateUserPayload: (payload) => {
        const Schema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
            fullname: Joi.string().required(), 
        });
        
        const result = Schema.validate(payload);

        if (result.error) {
            throw new InvariantError(result.error.message);
          }
      
          return result.value;
    }
}
module.exports = UserValidator;