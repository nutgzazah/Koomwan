const mongoose = require('mongoose');

// Define the comment schema
const commentSchema = new mongoose.Schema({
    commenter: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'commenterModel' // อ้างอิงตามค่าใน `commenterModel`
    },
    commenterModel: {
        type: String,
        required: true,
        enum: ['User', 'Doctor'] // กำหนดให้รองรับได้แค่ 2 โมเดล
    },
    role: {
        type: String,
        enum: ['owner', 'doctor'], // ใช้เพื่อระบุว่าคอมเมนต์มาจากเจ้าของโพสต์หรือไม่
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Schema for report reasons
const reportReasonSchema = new mongoose.Schema({
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
}, { _id: false });

// Define the forum post schema
const forumSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        default: null // Use null instead of an empty string
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
                ref: 'User',
                index: true // Improve performance for searching likes
            }
        ]
    },
    comments: [commentSchema],
    reports: {
        count: {
            type: Number,
            default: 0
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                index: true // Improve performance for searching reports
            }
        ],
        reasons: [reportReasonSchema]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Forum', forumSchema);
