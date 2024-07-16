const {ApiError} = require('../utils/ApiError')
const {Project} = require('../model/project.model')

const createProject = async (req, res, next)=>{
    try {
        const {name} = req.body;
        const projectExist = await Project.findOne({name})
        if(projectExist){
            throw new ApiError(400,'Project already exist')
        }
        let projectId;
        const projectsData = await Project.find({})
        if (projectsData.length === 0) {
            projectId = "PROJ001";
        } else {
            const lastProj =projectsData[projectsData.length - 1];
            const lastProjId = lastProj.projectId.split('J')[1]
            const nextProjIdNumber = (parseInt(lastProjId) + 1).toString().padStart(3, '0');
            projectId= `PROJ${nextProjIdNumber}`;
        }
        const projData = {
            projectId,
            name
        }
        const newProject = await Project.create(projData)
        res.status(201).json({
            status:"success",
            message:"Project created successfully",
            data: newProject
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createProject
}