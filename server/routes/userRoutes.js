const express = require('express')
const { requireSignIn } = require('../controllers/authController')
const { beginnerSetup, addHealthRecord } = require('../controllers/userController')


//router object
const router = express.Router()

//ROUTES

//BEGGINER SETUP|| POST
router.post('/beginnerSetup' /*,requireSignIn*/ , beginnerSetup)

//TRACKING
//ADD RECORD || POST
router.post('/addRecord' /*,requireSignIn*/ , addHealthRecord)

//export
module.exports = router