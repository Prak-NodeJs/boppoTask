const mongoose = require('mongoose')

const employeeSchema = mongoose.Schema({
    employeeId : {
        type:String,
        required:true,
        unique:true
    },
    fName:{
        type:String,
        required:true
    },
    lName:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true,
    },
    departmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Department'
    },
    onBoardDate:{
        type:String,
        required:true
    },
    deleted:{
        type:Boolean,
        default:false
    }
})


const Employee = new mongoose.model('Employee', employeeSchema)

module.exports = {
    Employee
}