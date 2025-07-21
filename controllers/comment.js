const Comment = require('../models/Comment');
const auth = require('../auth');
const {errorHandler} = auth;

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const { postId } = req.params;

    if (!comment || comment.trim() === "") {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const newComment = await Comment.create({
      content: comment,
      author: req.user.id,
      post: postId,
    });

    // Populate the author field for the response
    const populatedComment = await newComment.populate("author", "username email");

    res.status(201).json({
      message: "Your comment was successfully added",
      comment: populatedComment,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 // Get comments for a specific post
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Comments retrieved successfully",
      comments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Retrieve all comments 
module.exports.allComments = (req, res) =>{
   return Comment.find()
          .then(result => {

            if(result.length > 0){
              return res.status(200).send({message: 'All comments :',result});
            }
            return res.status(404).send('No active comment found')
          }).catch(err => errorHandler(err,req,res));   
}


// Delete a specific comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Allow either the comment author or an admin to delete
    const isAdmin = req.user.isAdmin || false; // optional: based on your verifyAdmin logic

    if (comment.author.toString() !== req.user.id && !isAdmin) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
