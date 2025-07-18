// routes/comment.js
const express = require("express");
const router = express.Router();

const commentController = require("../controllers/comment");
const { verify,verifyAdmin } = require("../auth"); // assuming you use this for authentication

// ✅ Route to add a comment
router.post("/addComment/:postId", verify, commentController.addComment);

// ✅ Route to get comments for a post
router.get("/getComment/:postId", verify,commentController.getCommentsByPost);

// get all comments
router.get('/allComments',verify, verifyAdmin, commentController.allComments);

// ✅ Route to delete a comment
router.delete("/deleteComment/:commentId",verify, verifyAdmin, commentController.deleteComment);

module.exports = router;
