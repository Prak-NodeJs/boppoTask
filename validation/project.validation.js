const Joi = require('joi')

const projCreate = {
    body:Joi.object().keys({
        name:Joi.string().required()
    })
}

module.exports = {
  projCreate
}