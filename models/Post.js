const mongoose = require("mongoose");
const Users = require("./Users");
const { post } = require("../routes/user");

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Title is required"],
        trim: true,
        minlength: [5, "Title must be atleast 5 characters"],
        maxlength: [50, "Title cannot exceed 50 characters"]
    },
    content: {
        type: String,
        required: [true, "Content is required"],
        minlength: [20, "Content should be atleast 20 characters"]
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: ['Technology', 'Business', 'Lifestyle', 'Education', 'Entertainment', 'Other'],
        default: "other"
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users,
        required: true
    },
    tags: [{
        type: String,
        trime: true
    }],
    image: {
        type: String,
        default: null
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Users
    }],
    views: {
        type: Number,
        default: 0
    },
    published: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

postSchema.index({title: "text", content: "text"})

postSchema.virtual("likesCount").get(function(){
    return this.likes.length;
})

//Mongoose uses toJSON for API responses and toObject for internal conversion, so we define both to keep behavior consistent.
postSchema.set("toJSON", {virtuals: true});
postSchema.set("toObject", {virtuals: true})

module.exports = mongoose.model("Post", postSchema)