const bcrypt = require("bcryptjs");

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, "Name must be atleast 3 characters"],
        maxlength: [50, "Name cannot exceed 50 characters"] 
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [3, "Password should be atleast 3 characters"]
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    avatar :{
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
})

// Custom method is function that is defined on the schema that works on the single document
userSchema.methods.comparePassword = async function(password) {
    console.log(password, this.password)
    return await bcrypt.compare(password, this.password)    
}

// Static methos is functio that is defined on the schema that we can directly using the mode
// eg: user.findByEmail("example@gmail.com")
userSchema.static.findByEmail = async function(email){
    return await this.findOne({email: email.toLowerCase()})
}

module.exports = mongoose.model("Users", userSchema)