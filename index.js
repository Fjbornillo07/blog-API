//Dependencies and Modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const auth = require('./auth');

// Routes
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

// Environment Setup (dotenv)
require('dotenv').config();

// Server setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended : true}));

// Cors section
app.use(cors());


// Database setup
mongoose.connect(process.env.MONGODB_STRING); 
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas :) '))

// BackEnd Routes
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);


// Server Response
if(require.main === module){

	app.listen(process.env.PORT || 4000, () => {

		console.log(`API is now online on port ${process.env.PORT || 4000}`);

	})
}

module.exports = { app, mongoose };
