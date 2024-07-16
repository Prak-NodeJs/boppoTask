const express = require('express')
const { onBoardEmployee,getEmployees, getDeptEmployees,getProjectEmployees,getAvgEmployeeAge,getEmployeeWorkingAndWorkedOn,getEmployeeProjectPeriod} = require('../controller/employee.controller')
const router = express.Router()
const {createEmployee, getEmployee,getDeptEmp,getProjEmp,getProjEmpPeriod } = require('../validation/employee.validation')
const {validate} = require('../utils/helper')


router.post('/',validate(createEmployee),onBoardEmployee)
router.get('/',validate(getEmployee), getEmployees)
router.get('/:departmentId',validate(getDeptEmp), getDeptEmployees)
router.get('/project/:projectId', validate(getProjEmp), getProjectEmployees)
router.post('/avgAge',getAvgEmployeeAge)
router.get('/empProjects/:projectId',validate(getProjEmp), getEmployeeWorkingAndWorkedOn)
router.get('/trackEmployees/:projectId',validate(getProjEmpPeriod ), getEmployeeProjectPeriod)



const employeeRoutes= router
module.exports   = {
    employeeRoutes
}