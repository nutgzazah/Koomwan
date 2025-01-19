const { hashPassword } = require('../helpers/authHelper');
const userModel = require('../models/userModel')

const registerController = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;

        // Validation
        if (!username) {
            return res.status(400).send({
                success: false,
                message: 'Username is required'
            });
        }
        if (!email) {
            return res.status(400).send({
                success: false,
                message: 'Email is required'
            });
        }
        if (!password || password.length < 6) {
            return res.status(400).send({
                success: false,
                message: 'Password is required and must be at least 6 characters long'
            });
        }
        if (!phone) {
            return res.status(400).send({
                success: false,
                message: 'Phone is required'
            });
        }

        // Check if username, email, or phone already exists
        const existingUsername = await userModel.findOne({ username });
        if (existingUsername) {
            return res.status(400).send({
                success: false,
                message: 'Username is already taken'
            });
        }

        const existingEmail = await userModel.findOne({ email });
        if (existingEmail) {
            return res.status(400).send({
                success: false,
                message: 'Email is already registered'
            });
        }

        const existingPhone = await userModel.findOne({ phone });
        if (existingPhone) {
            return res.status(400).send({
                success: false,
                message: 'Phone number is already registered'
            });
        }
        //hashed password
        const hashedPassword = await hashPassword(password)

        // save User
        const user = await userModel({
            username, 
            email, 
            password:hashedPassword, 
            phone
        }).save()

        return res.status(201).send({
            success: true,
            message: 'Registration successful, please login'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in register API',
            error,
        });
    }
}

module.exports = { registerController };
