const users = require("../models/Users");
const { generateToken } = require("../utils/jwt");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, avatar, isActive } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "user with email already exists",
      });
    }

    const user = await users.create({
      name,
      email,
      password,
      role,
      avatar,
      isActive,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide email and password"
        })
    }

    const user = await users.findOne({email});
    if(!user){
        return res.status(401).json({
            success: false,
            message: "User in unauthorized"
        })
    }

    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch){
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        })
    }

    const token = generateToken(user._id);

    return res.status(201).json({
        success: true,
        message: "Login successfully",
        token,
        user:{
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getProfile = async (req, res) =>{
    try{
        const user = await users.findById(req.body._id);

        return res.status(200).json({
            success: true,
            user
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal serer error",
            error: error.message
        })
    }
}

exports.updateProfile = async (req, res) =>{
    try{
        const userDetails = req.body;
        delete userDetails.role;
        delete userDetails.password;

        const user = await users.findByIdAndUpdate(
            req.body._id,
            userDetails,
            {new: true, runValidators: true}
        ).select("-password")

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.changePassword = async (req, res)=>{
    try{
        const { _id: userId, currentPassword, newPassword } = req.body;

        if(!currentPassword || !newPassword){
            return res.status(400).json({
                success: false,
                message: "Provide current password and new password"
            })
        }

        if(newPassword.length < 3){
            return res.status(400).json({
                success: false,
                message: "Password should not be less than 3 characters"
            })
        }

        const user = await users.findById(userId);
        const comparePassword = await user.comparePassword(currentPassword);
        if(!comparePassword){
            return res.status(400).json({
                success: false,
                message: "Pls provide the correct current password"
            })
        }

        user.password = newPassword;
        user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message    
        })
    }
}