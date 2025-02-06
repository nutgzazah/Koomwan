const JWT = require('jsonwebtoken')
const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel = require('../models/userModel')
const doctorModel = require('../models/doctorModel')
var { expressjwt: jwt } = require("express-jwt");

//middleware
const requireSignIn = jwt({
    secret:process.env.JWT_SECRET, algorithms: ["HS256"]
})

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

         // Check if username already exists in userModel or doctorModel
         const existingUsernameInUser = await userModel.findOne({ username });
         const existingUsernameInDoctor = await doctorModel.findOne({ username });
         if (existingUsernameInUser || existingUsernameInDoctor) {
             return res.status(400).send({
                 success: false,
                 message: 'Username is already taken',
             });
         }
 
         // Check if email already exists in userModel or doctorModel
         const existingEmailInUser = await userModel.findOne({ email });
         const existingEmailInDoctor = await doctorModel.findOne({ email });
         if (existingEmailInUser || existingEmailInDoctor) {
             return res.status(400).send({
                 success: false,
                 message: 'Email is already registered',
             });
         }
 
         // Check if phone already exists in userModel or doctorModel
         const existingPhoneInUser = await userModel.findOne({ phone });
         const existingPhoneInDoctor = await doctorModel.findOne({ phone });
         if (existingPhoneInUser || existingPhoneInDoctor) {
             return res.status(400).send({
                 success: false,
                 message: 'Phone number is already registered',
             });
         }
 
         // Hash password
         const hashedPassword = await hashPassword(password);
 
         // Save user
         const user = await userModel({
             username,
             email,
             password: hashedPassword,
             phone,
         }).save();
 
         return res.status(201).send({
             success: true,
             message: 'Registration successful, please login',
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

//doctor register
const registerDoctorController = async (req, res) => {
    try {
        const { username, email, password, phone, firstname, lastname, occupation, expert, hospital, document, image } = req.body;

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
        if (!firstname) {
            return res.status(400).send({
                success: false,
                message: 'First name is required'
            });
        }
        if (!lastname) {
            return res.status(400).send({
                success: false,
                message: 'Last name is required'
            });
        }
        if (!occupation) {
            return res.status(400).send({
                success: false,
                message: 'Occupation is required'
            });
        }
        if (!expert) {
            return res.status(400).send({
                success: false,
                message: 'Expert field is required'
            });
        }
        if (!hospital) {
            return res.status(400).send({
                success: false,
                message: 'Hospital name is required'
            });
        }
        if (!document) {
            return res.status(400).send({
                success: false,
                message: 'Document is required'
            });
        }

        // Optional image validation (if image is required)
        if (!image) {
            return res.status(400).send({
                success: false,
                message: 'Profile image is required'
            });
        }

        // Check if username already exists in userModel or doctorModel
        const existingUsernameInUser = await userModel.findOne({ username });
        const existingUsernameInDoctor = await doctorModel.findOne({ username });
        if (existingUsernameInUser || existingUsernameInDoctor) {
            return res.status(400).send({
                success: false,
                message: 'Username is already taken',
            });
        }

        // Check if email already exists in userModel or doctorModel
        const existingEmailInUser = await userModel.findOne({ email });
        const existingEmailInDoctor = await doctorModel.findOne({ email });
        if (existingEmailInUser || existingEmailInDoctor) {
            return res.status(400).send({
                success: false,
                message: 'Email is already registered',
            });
        }

        // Check if phone already exists in userModel or doctorModel
        const existingPhoneInUser = await userModel.findOne({ phone });
        const existingPhoneInDoctor = await doctorModel.findOne({ phone });
        if (existingPhoneInUser || existingPhoneInDoctor) {
            return res.status(400).send({
                success: false,
                message: 'Phone number is already registered',
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Save doctor
        const doctor = await doctorModel({
            username,
            email,
            password: hashedPassword,
            phone,
            firstname,
            lastname,
            occupation,
            expert,
            hospital,
            document,
            image,  // Save profile image
        }).save();

        return res.status(201).send({
            success: true,
            message: 'Doctor registration successful, please login',
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in doctor registration API',
            error,
        });
    }
}

//User check Duplicate
const checkDuplicateController = async (req, res) => {
    try {
        const { username, email, phone } = req.body;
        // Check if username, email, or phone already exists
        const existingUsernameUser = await userModel.findOne({ username });
        const existingUsernameDoctor = await doctorModel.findOne({ username });
        if (existingUsernameUser || existingUsernameDoctor) {
            return res.status(400).send({
                success: false,
                message: 'Username is already taken'
            });
        }

        const existingEmailInUser = await userModel.findOne({ email });
        const existingEmailInDoctor = await doctorModel.findOne({ email });
        if (existingEmailInUser || existingEmailInDoctor) {
            return res.status(400).send({
                success: false,
                message: 'Email is already registered',
            });
        }

        const existingPhoneInUser = await userModel.findOne({ phone });
        const existingPhoneInDoctor = await doctorModel.findOne({ phone });
        if (existingPhoneInUser || existingPhoneInDoctor) {
            return res.status(400).send({
                success: false,
                message: 'Phone number is already registered',
            });
        }

        // If no duplicates, return success
        return res.status(201).send({
            success: true,
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
    try {
        const { username, password } = req.body;
    
        // validation
        if (!username) {
          return res.status(500).send({
            success: false,
            message: 'Please provide username or phone number',
          });
        }
        if (!password) {
          return res.status(500).send({
            success: false,
            message: 'Please provide password',
          });
        }
    
        // Determine if username is a phone number or regular username
        let user;
        if (/^0[689]\d{8}$/.test(username)) {
            // If it's a Thai phone number
            user = await userModel.findOne({ phone: username });
            if (!user) {
                user = await doctorModel.findOne({ phone: username }); // Check in doctorModel if not found in userModel
            }
        } else {
            // If it's a regular username
            user = await userModel.findOne({ username });
            if (!user) {
                user = await doctorModel.findOne({ username }); // Check in doctorModel if not found in userModel
            }
        }
    
        if (!user) {
          return res.status(500).send({
            success: false,
            message: 'Username or phone number not found',
          });
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

// check Username or phone number before reset password
const checkUserResetPasswordController = async (req, res) => {
    try {
        const { username } = req.body;

        // Validation
        if (!username) {
            return res.status(400).send({
                success: false,
                message: 'Username or phone number is required',
            });
        }

        // Determine if username is a phone number or regular username
        let user;
        if (/^0[689]\d{8}$/.test(username)) {
            // If it's a Thai phone number
            user = await userModel.findOne({ phone: username });
            if (!user) {
                user = await doctorModel.findOne({ phone: username }); // Check in doctorModel if not found in userModel
            }
        } else {
            // If it's a regular username
            user = await userModel.findOne({ username });
            if (!user) {
                user = await doctorModel.findOne({ username }); // Check in doctorModel if not found in userModel
            }
        }
    
        if (!user) {
          return res.status(404).send({
            success: false,
            message: 'Username or phone number not found',
          });
        }
        return res.status(200).send({
            success: true,
            message: 'Able to change password',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in resetting password',
            error,
        });
    }
};

// Reset password by Username or phone number
const resetPasswordController = async (req, res) => {
    try {
        const { username, newPassword } = req.body;

        // Validation
        if (!username) {
            return res.status(400).send({
                success: false,
                message: 'Username or phone number is required',
            });
        }

        // Determine if username is a phone number or regular username
        let user;
        if (/^0[689]\d{8}$/.test(username)) {
            // If it's a Thai phone number
            user = await userModel.findOne({ phone: username });
            if (!user) {
                user = await doctorModel.findOne({ phone: username }); // Check in doctorModel if not found in userModel
            }
        } else {
            // If it's a regular username
            user = await userModel.findOne({ username });
            if (!user) {
                user = await doctorModel.findOne({ username }); // Check in doctorModel if not found in userModel
            }
        }
    
        if (!user) {
          return res.status(500).send({
            success: false,
            message: 'Username or phone number not found',
          });
        }

        // Hash the new password
        const hashedPassword = await hashPassword(newPassword);

        // Update the password
        user.password = hashedPassword;
        await user.save();


        return res.status(201).send({
            success: true,
            message: 'Password updated successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in resetting password',
            error,
        });
    }
};

module.exports = { requireSignIn, registerController, registerDoctorController, loginController, checkDuplicateController, resetPasswordController, checkUserResetPasswordController };
