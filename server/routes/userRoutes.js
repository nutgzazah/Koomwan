const express = require('express')
const { requireSignIn } = require('../controllers/authController')
const { beginnerSetup, } = require('../controllers/userController')
const { addHealthRecord, updateHealthRecord } = require('../controllers/trackingController')


//router object
const router = express.Router()

//ROUTES

//BEGGINER SETUP|| POST
router.post('/beginnerSetup' /*,requireSignIn*/ , beginnerSetup)

//TRACKING
//ADD RECORD || POST
router.post('/addRecord' /*,requireSignIn*/ , addHealthRecord)
//UPDATE RECORD || PUT
router.put('/updateRecord' /*,requireSignIn*/ , updateHealthRecord)



//export
module.exports = router