const Joi = require('@hapi/joi');

const registerValidation = data => {
  const schema = Joi.object({
    username: Joi.string().min(2).alphanum(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
  })
  return schema.validate(data)
}

const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  })
  return schema.validate(data)
}

const textValidation = data => {
  const schema = Joi.object({
    username: Joi.string().alphanum().required(),
    text: Joi.string().min(10).max(200).required(),
    userId: Joi.string().required()
  })
  return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.textValidation = textValidation