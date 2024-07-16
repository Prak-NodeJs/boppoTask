const express = require('express')
const router = express.Router()
const  multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  
const upload = multer({ storage: storage });

router.get('/', upload.single('file'), (req, res, next)=>{
    res.status(200).json({
        status:'success',
        message:"Uploaded successfully"
    })
})

const fileRoutes= router
module.exports   = {
   fileRoutes
}