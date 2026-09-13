const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(8).max(100).required(),
  role: Joi.string().valid('user', 'admin').default('user'),
});

module.exports = { UserPayloadSchema };
