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

// Get all users
const getAllUser = async (req, res) => {
    try {
        const users = await userModel.find().select("-password");
        return res.status(200).send({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error fetching users",
            error,
        });
    }
};

// Get all doctors
const getAllDoctor = async (req, res) => {
    try {
        const doctors = await doctorModel.find().select("-password");
        return res.status(200).send({
            success: true,
            data: doctors,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error fetching doctors",
            error,
        });
    }
};

// Get doctor by ID
const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Doctor ID is required",
            });
        }

        const doctor = await doctorModel.findById(id).select("-password"); // Exclude password for security

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: doctor,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching doctor data",
            error: error.message,
        });
    }
};


module.exports = { getUserByUsername, getAllUser, getAllDoctor, getDoctorById };
