const users = require("../models/Users");

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await users.find().select("-password");

    return res.status(200).json({
      success: true,
      users: allUsers,
      count: allUsers.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await users.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.createUser = async (req, res)=>{
    try{
        const {name, email, password, role, avatar, isActive} = req.body;

        const user = await users.create({
            name,
            email,
            password,
            role,
            avatar,
            isActive
        })
        
        return res.status(201).json({
            success: true,
            message: "User created successfully",
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

exports.updateUser = async (req, res) => {
  try {
    const user = await users
      .findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).select("-password");

    // custom method to check password is same or not
    //const isPasswordMatch = await users.comparePassword(req.body.password);


    if (!user) {
      return res.status(200).json({
        success: true,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await users.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
