const { Department } = require("../model/department.model")
const {ApiError} = require('../utils/ApiError')
const moment = require('moment')

const createDepartment = async (req, res, next)=>{
    try {
        const {name} = req.body;
        const deptExist = await Department.findOne({name})
        if(deptExist){
            throw new ApiError(400,'Department already exist')
        }

        let departmentId;
        const deptsData = await Department.find({})
        if (deptsData.length === 0) {
            departmentId = "DEPT001";
        } else {
            const lastDept = deptsData[deptsData.length - 1];
            const lastDeptId = lastDept.departmentId.split('T')[1]
            const nextDeptIdNumber = (parseInt(lastDeptId)+ 1).toString().padStart(3, '0');
            departmentId = `DEPT${nextDeptIdNumber}`;
        }
        const deptData = {
            name,
            departmentId,
            createdOn:moment().format('DD/MM/YY')
        }
        const newDept = await Department.create(deptData)
        res.status(201).json({
            status:"success",
            message:"Department created successfully",
            data: newDept
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createDepartment
}