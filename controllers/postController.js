const Post = require("../models/Post");
const mongoose = require("mongoose");

exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const posts = await Post.find(query)
      .populate("author", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);
    return res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limit),
      posts,
      page,
      limit,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      err: error.message,
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email avatar")
      .populate("likes", "name");

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }
    post.views += 1;
    post.save();

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      err: error.message,
    });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    const post = await Post.create({
      title,
      content,
      category,
      tags: tags || [],
      author: req.user._id,
    });
    await post.populate("author", "name email");

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this post",
      });
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("author", "name email");

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this post",
      });
    }

    await post.deleteOne();

    return res.status(200).json({
        success: true,
        message: "Post deleted successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal server error",
    });
  }
};

exports.toggleLike = async (req, res) =>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }
        const userId = req.user._id;
        const likeIndex = post.likes.indexOf(userId);

        if(likeIndex > -1){
            //unlike post
            post.likes.splice(likeIndex, 1);
        }else{
            //like post
            post.likes.push(userId);
        }

        await post.save();

        return res.status(200).json({
            success: true,
            message: likeIndex > -1 ? "Post unliked" : "Post liked",
            likesCount: post.likes.length
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error"
        })
    }
}