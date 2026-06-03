const validator = require("validator");

exports.validateRegister = (req, res, next) =>{
    const errors = [];

    const {name, email, password} = req.body;

    if(!name || validator.isEmpty(name.trim())){
        errors.push("Name is requried")
    }else if(name.trim().length < 3){
        errors.push("Name should be atleast 3 characters")
    }

    if(!email || !validator.isEmail(email)){
        errors.push("Email is invalid")
    }

    if(!password || validator.isEmpty(password)){
        errors.push("Password is required")
    }else if(password.trim().length < 6){
        errors.push("Password should be atleast 6 characters")
    }else if(!validator.isStrongPassword(password,{
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
    })){
        errors.push("Pls provide strong password, password should contain uppercase, lowercase and number")
    }

    if(errors.length > 0){
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })
    }
    next();
}

exports.validatePost = (req, res, next) =>{
    let errors = [];

    const {title, content} = req.body;

    if(!title || validator.isEmpty(title.trim())){
        errors.push("Title is required")
    }else if(title.length < 5){
        errors.push("Title should be atleast 5 characters")
    }

    if(!content || validator.isEmpty(content.trim())){
        errors.push("Content is required")
    }else if(content.length < 20){
        errors.push("Content should be atleast 20 characters")
    }

    if(errors.length > 1){
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })
    }   
    next()
}