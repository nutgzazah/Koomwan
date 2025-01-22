const express = require('express')
const { registerController, loginController, checkDuplicateController } = require('../controllers/userController')

//router object
const router = express.Router()

//routes
// REGISTER || POST
router.post('/register', registerController)
router.post('/checkDuplicate', checkDuplicateController)
// LOGIN || POST
router.post('/login', loginController)

//export
module.exports = router