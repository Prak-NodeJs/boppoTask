const Joi = require('joi')

const empProjCreate = {
    body:Joi.object().keys({
        projectId:Joi.string().required(),
        employeeId:Joi.string().required()
    })
}

module.exports = {
    empProjCreate
}