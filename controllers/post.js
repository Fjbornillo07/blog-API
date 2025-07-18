const Post = require('../models/Post');
const auth = require('../auth');
const Comment = require('../models/Comment');


exports.createPost = async (req, res) => {
  try {
  	// console.log("REQ.USER", req.user);
    const { title, content } = req.body;
    const newPost = await Post.create({
      title,
      content,
      author: req.user.id
    });
    res.status(201).json({message:'Post was successfully added',newPost});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username email")
      .populate({
        path: "comments", // virtual field
        populate: {
          path: "author",
          select: "username email"
        }
      })
      .exec(); // ensures virtuals are populated

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username email');
    
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comments = await Comment.find({ postId: req.params.id }).sort({ createdAt: -1 });

    res.json({
      post,
      comments
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.updatePost = async (req, res) => {
  try {
      const post = await Post.findById(req.params.id).populate('author', 'username email');
    if (!post) return res.status(404).json({ message: "Post not found" });
    const comments = await Comment.find({ postId: req.params.id }).sort({ createdAt: -1 });

    const { title, content } = req.body;
    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();
    res.json({message:'Post was successfully updated',post,comments});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Make sure post.author is a string before comparing
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne(); // or await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
