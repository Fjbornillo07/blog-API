const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const auth = require('../auth');

// Public
router.get('/getPosts',auth.verify, postController.getAllPosts);
router.get('/getPostById/:id',auth.verify, postController.getPostById);

// Protected
router.post('/addPost', auth.verify, postController.createPost);
router.patch('/updatePost/:id', auth.verify, postController.updatePost);
router.delete('/deletePost/:id',auth.verify,auth.verifyAdmin, postController.deletePost);

module.exports = router;
