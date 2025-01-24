const mongoose = require('mongoose');

// Define the comment schema for doctors
const commentSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor', // Reference to the Doctor model
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    _id: false // No need for separate IDs for comments in this case
});

// Define the forum post schema
const forumSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    content: {
        text: {
            type: String,
            required: true
        },
        image: {
            type: String, // Store the image URL or path
            default: ''
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes: {
        count: {
            type: Number,
            default: 0
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User' // Reference to the User model for tracking who liked the post
            }
        ]
    },
    comments: [commentSchema], // Array of comments from doctors
    reports: {
        count: {
            type: Number,
            default: 0
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User' // Reference to the User model for tracking who reported the post
            }
        ],
        reasons: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                reason: {
                    type: String,
                    required: true
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Forum', forumSchema);
