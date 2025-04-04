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
  
const getAllHelpRequest = async (req, res) => {
  try {
        const userId = req.auth._id;
        console.log(userId); 
    
        const problems = await HelpRequest.find({ user: userId }).lean();
    
        if (!problems || problems.length === 0) {
          return res.status(404).json({
            success: false,
            message: "No problems found for this user",
          });
        }
    
        return res.status(200).json({
          success: true,
          message: 'Problems retrieved successfully',
          problems,
        });
      } catch (error) {
        console.error("Error in getAllProblem:", error);
        return res.status(500).json({
          success: false,
          message: "Error retrieving problems",
          error: error.message,
        });
      }
};
  
const getHelpRequest = async (req, res) => {
    try {
      const { problemId } = req.params; 

      const report = await HelpRequest.findById(problemId).populate('user'); 

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      console.error("Error fetching help request:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching report data",
        error: error.message,
      });
    }
};


module.exports = {
  sentHelpRequest, getAllHelpRequest, getHelpRequest
};
