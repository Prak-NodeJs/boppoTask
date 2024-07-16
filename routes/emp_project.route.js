const express = require('express')
const { assignProject} = require('../controller/emp_project.controller')
const router = express.Router()
const {empProjCreate} = require('../validation/emp_project.validation')
const {validate} = require('../utils/helper')

router.post('/',validate(empProjCreate), assignProject)

const empProjectRoutes= router
module.exports   = {
    empProjectRoutes
}