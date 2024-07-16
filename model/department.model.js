const mongoose = require('mongoose')

const departmentSchema = mongoose.Schema({
  departmentId : {
    type:String,
    required:true,
    unique:true
 },
 name:{
    type:String,
    required:true
 },
 createdOn:{
    type:String,
    required:true
 }
})


const Department = new mongoose.model('Department', departmentSchema)

module.exports = {
    Department
}