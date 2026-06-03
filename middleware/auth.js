const jwt = require("jsonwebtoken");
const users = require("../models/Users");

exports.protect = async (req, res, next) =>{
    try{
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
        }

        if(!token){
            return res.status(400).json({
                success: false,
                message: "Token is required"
            })
        }

        const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await users.findById(decodeToken.id);

        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        if(!user.isActive){
            return res.status(403).json({
                success: false,
                message: "User is not active"
            })
        }

        req.user = user;
        next()
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Token invalid or expired"
        })
    }
}

exports.restrictTo = (...roles) =>{
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action"
            })
        }
        next();
    }
}