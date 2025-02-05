const express = require('express')
const { registerController, loginController, checkDuplicateController, resetPasswordController, checkUserResetPasswordController, requireSignIn, registerDoctorController } = require('../controllers/authController')
const { getUserByUsername } = require('../controllers/userController')

//router object
const router = express.Router()

//routes
// REGISTER || POST
router.post('/register', registerController)
router.post('/registerdoctor', registerDoctorController)
router.post('/checkDuplicate', checkDuplicateController)
// LOGIN || POST
router.post('/login', loginController)

// FORGET PASSWORD 
router.post('/checkUserResetPassword', checkUserResetPasswordController)
router.put('/resetPassword' /*,requireSignIn*/ , resetPasswordController)

//GET USER data by username
//GET /api/user/{username}
router.get("/user/:username", getUserByUsername);

//export
module.exports = router