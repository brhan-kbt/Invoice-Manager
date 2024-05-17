const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().max(30).required().messages({
    'string.base': `"name" should be a type of 'text'`,
    'string.empty': `"name" cannot be an empty field`,
    'string.max': `"name" should have a maximum length of {#limit}`,
    'any.required': `"name" is a required field`
  }),
  email: Joi.string().email().max(50).required().messages({
    'string.email': `"email" must be a valid email`,
    'string.max': `"email" should have a maximum length of {#limit}`,
    'any.required': `"email" is a required field`
  }),
  password: Joi.string().min(8).max(16)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,16}$'))
    .required().messages({
      'string.pattern.base': `"password" must contain at least one uppercase letter, one lowercase letter, one number, and one special character`,
      'string.min': `"password" should have a minimum length of {#limit}`,
      'string.max': `"password" should have a maximum length of {#limit}`,
      'any.required': `"password" is a required field`
    })
});

function validateUser(user) {
  const { error } = userSchema.validate(user);
  if (error) {
    throw new Error(error.details[0].message);
  }
}

module.exports = validateUser;
