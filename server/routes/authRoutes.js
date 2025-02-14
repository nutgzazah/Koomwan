const express = require('express')
const { registerController, loginController, checkDuplicateController, resetPasswordController, checkUserResetPasswordController, registerDoctorController } = require('../controllers/authController')


//router object
const router = express.Router()

//ROUTES

// REGISTER || POST
router.post('/register', registerController)
router.post('/registerdoctor', registerDoctorController)
router.post('/checkDuplicate', checkDuplicateController)

// LOGIN || POST
router.post('/login', loginController)

// FORGET PASSWORD 
router.post('/checkUserResetPassword', checkUserResetPasswordController)
router.put('/resetPassword', resetPasswordController)

//export
module.exports = router