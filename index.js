require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const app = express();
const jwt = require('jsonwebtoken');

// Import Models
const Comment = require('./models/comment.model.js');
const Post = require('./models/post.model.js');
const User = require('./models/user.model.js');

// Middleware
app.use(express.json());
const auth = require('./middlewares/auth'); // Import the authorization middleware
app.use('/uploads', express.static('uploads')); 

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate unique filename
    }
});

const upload = multer({ storage: storage });

// Routes


// Home route
app.get('/', (req, res) => {
    res.send("Hello from Node API server");
});

// User Registration
app.post('/api/register', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token });
});

// Comment Routes
app.post('/api/comments', async (req, res) => {
    try {
        const comment = await Comment.create(req.body); // Ensure req.body includes commentorID, content, and postID
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get all comments for a post
app.get('/api/posts/:postId/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ postID: req.params.postId });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Post Routes
// Post Routes
app.post('/api/posts', async (req, res) => {
    try {
        const post = await Post.create(req.body); // Ensure req.body includes authorID, title, and content
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get all posts
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find().populate('comments'); // Populate comments if needed
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/Blog')
    .then(() => {
        console.log('Connected to MongoDB!');
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch((error) => {
        console.log("Connection failed", error);
    });
