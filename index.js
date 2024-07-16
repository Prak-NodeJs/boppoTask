const express = require('express')
const dotenv = require('dotenv')
const { connectToDB } = require('./utils/connection')
const {employeeRoutes} = require('./routes/employee.route')
const {departmentRoutes} = require('./routes/department.route')
const { projectRoutes } = require('./routes/project.route')
const {empProjectRoutes} = require('./routes/emp_project.route')
const { fileRoutes} = require('./routes/file.route')

dotenv.config({})

const app= express()

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


//mongodb
connectToDB()

app.use('/v1/emp', employeeRoutes)
app.use('/v1/dept', departmentRoutes)
app.use('/v1/project', projectRoutes)
app.use('/v1/emp_proj',empProjectRoutes)
app.use('/v1/file/upload', fileRoutes)


app.use((err, req, res, next)=>{
    const message = err.message || 'Internal Server Error'
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        stutus:"error",
        message
    })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(`Server is listing on port ${PORT}`)
})