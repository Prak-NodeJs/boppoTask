const {ApiError} = require('../utils/ApiError') 
const {Employee} = require('../model/employee.model')
const moment = require('moment')
const { Project } = require('../model/project.model')
const {EmpProject} = require('../model/emp_project.model')

const assignProject = async (req, res, next)=>{
    try {
        const {projectId, employeeId} = req.body;

        const projExist = await Project.findOne({projectId})
        if(!projExist){
            throw new ApiError(400,`Project not found with id ${projectId}`)
        }

        const empExist = await Employee.findOne({employeeId})
        if(!empExist){
            throw new ApiError(400,`Employee not found with id ${employeeId}`)
        }

        const empData = {
            employeeId:empExist._id,
            projectId:projExist._id,
            joined:moment().format('DD/MM/YY'),
        }

        projExist.startedOn = moment().format('DD/MM/YY')
        await projExist.save()

        const newEmpProject = await EmpProject.create(empData)
        res.status(201).json({
            status:"success",
            message:"Employee assigned to project successfully",
            data: newEmpProject
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    assignProject
}