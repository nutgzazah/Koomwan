const HelpRequest = require("../models/helpRequestModel");

const sentHelpRequest = async (req, res) => {
  try {
      // Destructure userId directly from req.auth._id
      const userId = req.auth._id;
      const { title, detail } = req.body;

      // Check if userId is provided in the request
      if (!userId) {
          return res
            .status(401)
            .json({ success: false, message: "User ID is required" });
      }

      // Validate required fields (title and detail)
      if (!title || !detail) {
          return res.status(402).json({ 
              success: false, 
              message: "Title and Detail are required." 
          });
      }

      // Create the help request report
      const reportData = { 
          user: userId,  // use userId here instead of user._id
          title, 
          detail,
      };

      const report = new HelpRequest(reportData);
      await report.save();

      // Send the successful response with the created report data
      res.status(201).json({ 
          success: true, 
          message: "Report posted successfully.", 
          data: report 
      });

  } catch (error) {
      console.error("Error in sentHelpRequest:", error);
      res.status(500).json({ 
          success: false, 
          message: "Internal Server Error", 
          error: error.message 
      });
  }
};


module.exports = {
  sentHelpRequest
};
