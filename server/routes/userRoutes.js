const express = require('express')
const { requireSignIn } = require('../controllers/authController')
const { beginnerSetup, } = require('../controllers/userController')
const { addRecord, updateRecord, deleteRecord, getRecord } = require('../controllers/trackingController')


//router object
const router = express.Router()

//ROUTES

//BEGGINER SETUP|| POST
router.post('/beginnerSetup' /*,requireSignIn*/ , beginnerSetup)



//TRACKING
//GET ROCORD || GET
router.get('/getRecord' /*,requireSignIn*/ , getRecord)
//ADD RECORD || POST
router.post('/addRecord' /*,requireSignIn*/ , addRecord)
//UPDATE RECORD || PUT
router.put('/updateRecord/:recordId' /*,requireSignIn*/ , updateRecord)
//DELETE RECORD || DELETE
router.delete('/deleteRecord/:recordId' /*,requireSignIn*/ , deleteRecord)

//export
module.exports = router