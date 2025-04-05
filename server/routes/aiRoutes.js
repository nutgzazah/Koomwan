const express = require("express")
const { predictFromAI } = require("../controllers/aiController")
const router = express.Router()

router.post("/predict", predictFromAI)

module.exports = router