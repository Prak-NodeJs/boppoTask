const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
    projectId : {
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    startedOn:{
        type:String,
    }
})


const Project = new mongoose.model('Project', projectSchema)

module.exports = {
    Project
}