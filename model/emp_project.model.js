const mongoose = require('mongoose')

const empProjectSchema = mongoose.Schema({
    projectId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project'
    },
    employeeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Employee'
    },
    joined:{
        type:String,
        required:true
    },
    exit:{
        type:String,
    }
})


const EmpProject = new mongoose.model('EmpProject', empProjectSchema)

module.exports = {
    EmpProject
}