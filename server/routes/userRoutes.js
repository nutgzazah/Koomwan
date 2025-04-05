const express = require("express");
const { requireSignIn } = require("../controllers/authController");
const {
  beginnerSetup,
  getHealthInfo,
  getUserProfile,
  updateHealthInfo,
  updateUserBasicInfo,
  removeRegularPills,
  addRegularPill,
} = require("../controllers/userController");
const {
  addRecord,
  updateRecord,
  deleteRecord,
  getRecord,
} = require("../controllers/trackingController");
const { sentHelpRequest, getHelpRequest, getAllHelpRequest } = require('../controllers/helpRequestController');
const { sendReminder, getAllNotification } = require('../controllers/notificationController');

//router object
const router = express.Router();

//ROUTES

//PROFILE
// PROFILE || GET
router.get("/profile/:userId", requireSignIn, getUserProfile);
// HEALTHINFO || GET
router.get("/healthinfo/:healthInfoId", requireSignIn, getHealthInfo);
// UPDATE USER BASIC INFO (email, phone) || PUT
router.put("/update/:userId", requireSignIn, updateUserBasicInfo);
// UPDATE HEALTH INFO || PUT
router.put("/healthinfo/:healthInfoId", requireSignIn, updateHealthInfo);
// REMOVE REGULAR PILLS || PUT
router.put(
  "/healthinfo/:healthInfoId/remove-pills",
  requireSignIn,
  removeRegularPills
);
// ADD REGULAR PILL || POST
router.post(
  "/healthinfo/:healthInfoId/add-pill",
  requireSignIn,
  addRegularPill
);

//BEGGINER SETUP|| POST
router.post("/beginnerSetup", requireSignIn, beginnerSetup);

//TRACKING
//GET ROCORD || GET
router.get("/getRecord/:userId", requireSignIn, getRecord);
//ADD RECORD || POST
router.post("/addRecord" /*,requireSignIn*/, addRecord);
//UPDATE RECORD || PUT
router.put("/updateRecord/:recordId" /*,requireSignIn*/, updateRecord);
//DELETE RECORD || DELETE
router.delete("/deleteRecord/:recordId" /*,requireSignIn*/, deleteRecord);

// Setting (Sent Help Request) || POST
router.post("/sentHelpRequest",requireSignIn , sentHelpRequest);

// Get Remider
router.get('/sentMedicineNoti', requireSignIn, sendReminder);

router.get('/getAllNotification', requireSignIn, getAllNotification);

router.get('/getAllProblem', requireSignIn, getAllHelpRequest);

router.get('/getProblem/:problemId',requireSignIn, getHelpRequest); 
//export
module.exports = router;
