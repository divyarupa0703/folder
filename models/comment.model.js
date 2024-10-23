const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema(
    {
        commentID: {
            type: String,
            default: () => new mongoose.Types.ObjectId().toString(), // Automatically generate an ID
            required: true,
        },
        commentorID: {
            type: mongoose.Schema.Types.ObjectId, // Use ObjectId to reference the user
            required: [true],
        },
        content: {
            type: String,
            required: [true, "Please enter the content."],
        },
        no_of_likes: {
            type: Number,
            default: 0,
        },
        postID: {
            type: mongoose.Schema.Types.ObjectId, // Use ObjectId to reference the post
            required: [true, "Post ID is required."],
        },
    },
    {
        timestamps: true,
    }
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
