const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    healthScore: {
        type: Number,
        min: 0,
        max: 10,
        required: true
    },
    healthResult: {
        type: String,
        required: true
    },
    riskScore: {
        type: Number,
        min: 0,
        max: 10,
        required: true
    },
    healthAdvice: {
        type: String,
        required: true
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog' // Reference to the Blog model
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Suggestion', suggestionSchema);
