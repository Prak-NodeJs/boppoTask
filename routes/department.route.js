const express = require('express')
const { createDepartment } = require('../controller/department.controller')
const router = express.Router()
const {deptCreate} = require('../validation/department.validation')
const {validate} = require('../utils/helper')

router.post('/',validate(deptCreate),createDepartment)

const departmentRoutes= router
module.exports   = {
   departmentRoutes
}