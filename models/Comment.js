const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content:{
        type: String,
        required: [true, "Content is requried"],
        trim: true,
        minlength: [1, "Comment should be atleast 1 character"],
        maxlength: [50, "Comment cannot exceed 50 characters"]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Comments", commentSchema)