const { ApiError } = require('../utils/ApiError')
const { Employee } = require('../model/employee.model')
const { Department } = require('../model/department.model')
const { Project } = require('../model/project.model')
const moment = require('moment')

//onboardemployee
const onBoardEmployee = async (req, res, next) => {
    try {
        const { fName, lName, age, departmentId } = req.body;

        const deptExist = await Department.findOne({ departmentId })
        if (!deptExist) {
            throw new ApiError(400, `Department not found with id ${departmentId}`)
        }

        let empId;
        const empsData = await Employee.find({})
        if (empsData.length === 0) {
            empId = "EMP001";
        } else {
            const lastEmp = empsData[empsData.length - 1];
            const lastEmpId = lastEmp.employeeId.split('P')[1]
            const nextEmpIdNumber = (parseInt(lastEmpId) + 1).toString().padStart(3, '0');
            empId = `EMP${nextEmpIdNumber}`;
        }
        const empData = {
            employeeId: empId,
            fName,
            lName,
            age,
            departmentId: deptExist._id,
            onBoardDate: moment().format('DD/MM/YY')
        }
        const newEmp = await Employee.create(empData)
        res.status(201).json({
            status: "success",
            message: "Employee created successfully",
            data: newEmp
        })
    } catch (error) {
        next(error)
    }
}

//list and filter based on employeeid, employeename
const getEmployees = async (req, res, next) => {
    try {

        const { employeeId, employeeName } = req.query;
        const match = {}
        match.deleted=false
        if (employeeId) {
            match.employeeId = employeeId
        }

        if (employeeName) {
            match.$or = [
                { fName: { $regex: employeeName, $options: 'i' } },
                { lName: { $regex: employeeName, $options: 'i' } }
            ];
        }

        const employessData = await Employee.aggregate([
            {
                $match: match
            },
            {
                $lookup: {
                    from: 'departments',
                    localField: 'departmentId',
                    foreignField: '_id',
                    as: 'department'
                }
            },
            {
                $unwind: {
                    path: "$department",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'empprojects',
                    localField: '_id',
                    foreignField: 'employeeId',
                    as: 'empProjects'
                }
            },
            {
                $lookup: {
                    from: 'projects',
                    localField: 'empProjects.projectId',
                    foreignField: '_id',
                    as: 'projects'
                }
            },
            {
                $project: {
                    _id: 0,
                    employeeId: '$employeeId',
                    employeeName: '$fName',
                    departmentId: '$department.departmentId',
                    departmentName: '$department.name',
                    currentlyWorkingProject: '$projects'
                }
            }
        ]);

        employessData.map((item) => {
            if (item.currentlyWorkingProject) {
                const formatedProject = item.currentlyWorkingProject.map((item2) => {
                    return {
                        projectName: item2.name,
                        projectId: item2.projectId
                    }
                })
                item.currentlyWorkingProject = formatedProject;
            }
        })

        res.status(200).json({
            status: "success",
            message: "Employees fetched successfully",
            data: employessData
        })
    } catch (error) {
        next(error)
    }
}

//get department and their employees
const getDeptEmployees = async (req, res, next) => {
    try {
        const { departmentId } = req.params

        const mongodbDeptId = await Department.findOne({ departmentId })

        if (!mongodbDeptId) {
            throw new ApiError(404, `Department with id ${departmentId}`)
        }
        const employessData = await Employee.aggregate([
            {
                $match: { departmentId: mongodbDeptId._id, deleted:false }
            },
            {
                $lookup: {
                    from: 'departments',
                    localField: 'departmentId',
                    foreignField: '_id',
                    as: 'department'
                }
            },
            {
                $unwind: {
                    path: "$department",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    employeeId: '$employeeId',
                    employeeName: '$fName',
                    departmentId: '$department.departmentId',
                    departmentName: '$department.name',
                }
            }
        ]);
        res.status(201).json({
            status: "success",
            message: "Department employees successfully",
            data: employessData
        })
    } catch (error) {
        next(error)
    }
}

//get projects and employees
const getProjectEmployees = async (req, res, next) => {
    try {
        const { projectId } = req.params

        const mongodbProjectId = await Project.findOne({ projectId })

        if (!mongodbProjectId) {
            throw new ApiError(404, `Project with id ${projectId} not found`)
        }

        const employessData = await Employee.aggregate([
            {
                $match: {
                    deleted: false
                }
            },
            {
                $lookup: {
                    from: 'empprojects',
                    localField: '_id',
                    foreignField: 'employeeId',
                    as: 'empProjects'
                }
            },
            {
                $match: {
                    "empProjects.projectId": mongodbProjectId._id
                }
            },
            {
                $lookup: {
                    from: 'projects',
                    localField: 'empProjects.projectId',
                    foreignField: '_id',
                    as: 'projects'
                }
            },
            {
                $project: {
                    _id: 0,
                    employeeId: '$employeeId',
                    employeeName: '$fName',
                    departmentId: '$department.departmentId',
                    departmentName: '$department.name',
                    currentlyWorkingProject: '$projects'
                }
            }
        ]);

        employessData.map((item) => {
            if (item.currentlyWorkingProject) {
                const formatedProject = item.currentlyWorkingProject.map((item2) => {
                    return {
                        projectName: item2.name,
                        projectId: item2.projectId,
                        WorkingFrom: `Working from ${item2.startedOn}`
                    }
                })
                item.currentlyWorkingProject = formatedProject;
            }
        })
        res.status(201).json({
            status: "success",
            message: "Project employees successfully",
            data: employessData
        })
    } catch (error) {
        next(error)
    }
}

// Get a overall list of employees working and worked on a specific project
const getEmployeeWorkingAndWorkedOn = async (req, res, next) => {
    try {
        const { projectId } = req.params

        const mongodbProjectId = await Project.findOne({ projectId })

        if (!mongodbProjectId) {
            throw new ApiError(404, `Project with id ${projectId} not found`)
        }

        const employessData = await Employee.aggregate([
            {
                $match: {
                    deleted: false
                }
            },
            {
                $lookup: {
                    from: 'empprojects',
                    localField: '_id',
                    foreignField: 'employeeId',
                    as: 'empProjects'
                }
            },
            {
                $match: {
                    "empProjects.projectId": mongodbProjectId._id,
                    $or: [
                        { "empProjects.joined": { $ne: null, $ne: "" } },
                        { "empProjects.exit": { $ne: null, $ne: "" } }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'projects',
                    localField: 'empProjects.projectId',
                    foreignField: '_id',
                    as: 'projects'
                }
            },
            {
                $project: {
                    _id: 0,
                    employeeId: '$employeeId',
                    employeeName: '$fName',
                    departmentId: '$department.departmentId',
                    departmentName: '$department.name',
                    currentlyWorkingProject: '$projects'
                }
            }
        ]);

        employessData.map((item) => {
            if (item.currentlyWorkingProject) {
                const formatedProject = item.currentlyWorkingProject.map((item2) => {
                    return {
                        projectName: item2.name,
                        projectId: item2.projectId,
                        WorkingFrom: `Working from ${item2.startedOn}`
                    }
                })
                item.currentlyWorkingProject = formatedProject;
            }
        })

        res.status(201).json({
            status: "success",
            message: "Project employees successfully",
            data: employessData
        })
    } catch (error) {
        next(error)
    }
}

//get a overall list
const getEmployeeProjectPeriod = async (req, res, next) => {
    try {
        const { projectId } = req.params
        const {startDate, endDate} = req.query

        const mongodbProjectId = await Project.findOne({ projectId })

        if (!mongodbProjectId) {
            throw new ApiError(404, `Project with id ${projectId} not found`)
        }

        const employessData = await Employee.aggregate([
            {
                $match: {
                    deleted: false
                }
            },
            {
                $lookup: {
                    from: 'empprojects',
                    localField: '_id',
                    foreignField: 'employeeId',
                    as: 'empProjects'
                }
            },
            {
                $match: {
                    "empProjects.projectId": mongodbProjectId._id,
                    $and: [
                        { "empProjects.joined": startDate },
                        { "empProjects.exit":endDate }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'projects',
                    localField: 'empProjects.projectId',
                    foreignField: '_id',
                    as: 'projects'
                }
            },
            {
                $project: {
                    _id: 0,
                    employeeId: '$employeeId',
                    employeeName: '$fName',
                    departmentId: '$department.departmentId',
                    departmentName: '$department.name',
                    currentlyWorkingProject: '$projects'
                }
            }
        ]);

        employessData.map((item) => {
            if (item.currentlyWorkingProject) {
                const formatedProject = item.currentlyWorkingProject.map((item2) => {
                    return {
                        projectName: item2.name,
                        projectId: item2.projectId,
                        WorkingFrom: `Working from ${item2.startedOn}`
                    }
                })
                item.currentlyWorkingProject = formatedProject;
            }
        })

        res.status(201).json({
            status: "success",
            message: "Sepecific Period employees retrived successfully",
            data: employessData
        })
    } catch (error) {
        next(error)
    }
}

//get department and average age
const getAvgEmployeeAge = async (req, res, next) => {
    try {
        const employessData = await Employee.aggregate([
            {
                $match: {
                    deleted: false
                }
            },
            {
                $lookup: {
                    from: 'departments',
                    localField: 'departmentId',
                    foreignField: '_id',
                    as: 'department'
                }
            },
            {
                $unwind: {
                    path: "$department",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: {
                        departmentId: "$department.departmentId",
                        departmentName: "$department.name"
                    },
                    avg_age: { $avg: "$age" },
                }
            },
            {
                $project: {
                    _id: 0,
                    departmentId: '$_id.departmentId',
                    departmentName: '$_id.departmentName',
                    avg_age: '$avg_age'
                }
            }
        ]);


        res.status(201).json({
            status: "success",
            message: "Average department Age successfully",
            data: employessData
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    onBoardEmployee,
    getEmployees,
    getDeptEmployees,
    getProjectEmployees,
    getAvgEmployeeAge, 
    getEmployeeWorkingAndWorkedOn,
    getEmployeeProjectPeriod
}