const express = require('express')
const { registerController, loginController, checkDuplicateController, resetPasswordController, checkUserResetPasswordController } = require('../controllers/userController')

//router object
const router = express.Router()

//routes
// REGISTER || POST
router.post('/register', registerController)
router.post('/checkDuplicate', checkDuplicateController)
// LOGIN || POST
router.post('/login', loginController)

// FORGET PASSWORD 
router.post('/checkUserResetPassword', checkUserResetPasswordController)
router.put('/resetPassword', resetPasswordController)

//export
module.exports = router