const mongoose = require('mongoose');

const PostSchema = mongoose.Schema(
    {
        postID: {
            type: String, // Use String if you want to assign a custom ID
            default: () => new mongoose.Types.ObjectId().toString(), // Automatically generate an ID
            required: true,
        },
        authorID: {
            type: mongoose.Schema.Types.ObjectId, // Use ObjectId to reference a user
            required: true,
        },
        title: {
            type: String,
            required: [true, "Post title is required."],
        },
        content: {
            type: String,
            required: [true, "Post content is required."],
        },
        tags: {
            type: [String],
        },
        comments: [{
            type: mongoose.Schema.Types.ObjectId, // Use ObjectId to reference comments
            ref: 'Comment' // Reference to the Comment model
        }],
        likes: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
