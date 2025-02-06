const express = require('express')
const { requireSignIn } = require('../controllers/authController')
const { beginnerSetup } = require('../controllers/userController')


//router object
const router = express.Router()

//ROUTES

//BEGGINER SETUP|| POST
router.post('/beginnerSetup' /*,requireSignIn*/ , beginnerSetup)

//export
module.exports = router