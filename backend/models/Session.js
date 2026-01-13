const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Subject',
        },
        duration: {
            type: Number,
            required: [true, 'Please add duration in minutes'],
        },
        date: {
            type: Date,
            required: [true, 'Please add a date'],
            default: Date.now,
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Session', sessionSchema);
