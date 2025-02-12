const express = require('express')
const { getUserByUsername, getAllUser, getAllDoctor } = require('../controllers/adminController')

//router object
const router = express.Router()

//routes

//USER data|| GET
router.get("/user", getAllUser);
router.get("/doctor", getAllDoctor);
router.get("/user/:username", getUserByUsername);

//export
module.exports = router