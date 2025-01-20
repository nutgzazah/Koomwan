const JWT = require('jsonwebtoken')
const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel = require('../models/userModel')

//register
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

//login
const loginController = async (req,res) => {
    try{
        const {username, password} = req.body
        //validation
        if(!username){
            return res.status(500).send({
                success:false,
                message:'Please provide username'
            }
            )
        }
        if(!password){
            return res.status(500).send({
                success:false,
                message:'Please provide password'
            }
            )
        }
        //find user
        const user = await userModel.findOne({username})
        if(!user){
            return res.status(500).send({
                success:false,
                message:'Username not found'
            })
        }
        //match password
        const match = await comparePassword(password, user.password)
        if(!match){
            return res.status(500).send({
                success:false,
                message:'Invalid username or password'
            })
        }
        //TOKEN JWT
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET,{
            expiresIn:'7d'
        })

        //แสดงข้อมูลหลัง Login สำเร็จแต่ไม่ต้องแสดง password ที่บันทึกไว้จริง
        user.password = undefined

        res.status(200).send({
            success:true,
            message:'Login successfully',
            token,
            user,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error in login API',
            error
        })
    }
}

module.exports = { registerController, loginController };
