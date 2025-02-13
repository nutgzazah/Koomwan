const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String, // URL หรือ path ของรูปภาพ
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    ref: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Blog', blogSchema);
