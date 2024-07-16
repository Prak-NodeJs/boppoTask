const Joi = require('joi')

const deptCreate = {
    body:Joi.object().keys({
        name:Joi.string().required()
    })
}

module.exports = {
  deptCreate
}