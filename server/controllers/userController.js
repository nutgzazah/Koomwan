const userModel = require("../models/userModel");
const doctorModel = require("../models/doctorModel");

// Get user by username
const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).send({
                success: false,
                message: "Username is required",
            });
        }

        // Search for the user in both models
        const user = await userModel.findOne({ username });
        const doctor = await doctorModel.findOne({ username });

        if (!user && !doctor) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        // Determine which model the user was found in
        const userData = user || doctor;

        return res.status(200).send({
            success: true,
            data: userData,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error fetching user data",
            error,
        });
    }
};

module.exports = { getUserByUsername };
