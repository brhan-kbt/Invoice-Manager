const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().max(30).required(),
  email: Joi.string().email().max(50).required(),
  password: Joi.string().min(8).max(16).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,16}$')).required(),
});

function validateUser(user) {
  return userSchema.validate(user);
}

module.exports = { validateUser };
