const express = require('express')
const {createProject} = require('../controller/project.controller')
const { validate } = require('../utils/helper')
const { projCreate } = require('../validation/project.validation')
const router = express.Router()


router.post('/',validate(projCreate),createProject)

const projectRoutes= router
module.exports   = {
    projectRoutes
}