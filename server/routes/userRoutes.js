const express = require("express");
const { requireSignIn } = require("../controllers/authController");
const {
  beginnerSetup,
  getHealthInfo,
  getUserProfile,
  updateHealthInfo,
  updateUserBasicInfo,
} = require("../controllers/userController");
const {
  addRecord,
  updateRecord,
  deleteRecord,
  getRecord,
} = require("../controllers/trackingController");

//router object
const router = express.Router();

//ROUTES
// PROFILE || GET
router.get("/profile/:userId", requireSignIn, getUserProfile);
// HEALTHINFO || GET
router.get("/healthinfo/:healthInfoId", requireSignIn, getHealthInfo);

// UPDATE USER BASIC INFO (email, phone) || PUT
router.put("/update/:userId", requireSignIn, updateUserBasicInfo);
// UPDATE HEALTH INFO || PUT
router.put("/healthinfo/:healthInfoId", requireSignIn, updateHealthInfo);

//BEGGINER SETUP|| POST
router.post("/beginnerSetup" /*,requireSignIn*/, beginnerSetup);

//TRACKING
//GET ROCORD || GET
router.get("/getRecord/:userId", requireSignIn, getRecord);
//ADD RECORD || POST
router.post("/addRecord" /*,requireSignIn*/, addRecord);
//UPDATE RECORD || PUT
router.put("/updateRecord/:recordId" /*,requireSignIn*/, updateRecord);
//DELETE RECORD || DELETE
router.delete("/deleteRecord/:recordId" /*,requireSignIn*/, deleteRecord);

//export
module.exports = router;
