const Joi = require('joi')

const createEmployee = {
    body:Joi.object().keys({
        fName:Joi.string().required(),
        lName:Joi.string().required(),
        age:Joi.number().required(),
        departmentId:Joi.string().required()
    })
}

const getEmployee = {
    query:Joi.object().keys({
        employeeId:Joi.string(),
        employeeName:Joi.string()
    })
}

const getDeptEmp = {
    params:Joi.object().keys({
        departmentId:Joi.string().required()
    })
}

const getProjEmp = {
    params:Joi.object().keys({
        projectId:Joi.string().required()
    })
}
const getProjEmpPeriod = {
    params:Joi.object().keys({
        startDate:Joi.string().required(),
        endDate:Joi.string().required()
    })
}

module.exports = {
    createEmployee , getEmployee,getDeptEmp,getProjEmp ,getProjEmpPeriod 
}